# 백업 전략 (Backup Strategy)

본 문서는 ALL-ERP 시스템의 데이터 백업 및 복구 전략을 정의합니다.

## 1. 백업 대상

### 1.1 필수 백업 데이터
- **PostgreSQL**: 모든 테넌트 스키마 데이터
- **MinIO**: AI 서비스 업로드 문서 (RAG 지식베이스)
- **Milvus**: Vector 인덱스 데이터
- **GitLab**: 소스코드 저장소 및 CI/CD 설정

### 1.2 선택적 백업
- **Redis**: 캐시 데이터 (재생성 가능하므로 낮은 우선순위)
- **RabbitMQ**: 메시지 큐 (일시적 데이터이므로 선택적)

---

## 2. 백업 주기

### 2.1 PostgreSQL (DB)

| 백업 유형 | 주기 | 보관 기간 | 방법 |
|----------|------|----------|------|
| **Full Backup** | 매일 02:00 AM | 30일 | `pg_dump` |
| **Incremental** | 6시간마다 | 7일 | WAL Archiving |
| **Snapshot** | 주 1회 (일요일) | 90일 | 클라우드/NAS Snapshot |

### 2.2 MinIO (객체 저장소)

| 백업 유형 | 주기 | 보관 기간 | 방법 |
|----------|------|----------|------|
| **Full Backup** | 매일 03:00 AM | 30일 | `mc mirror` |
| **Snapshot** | 주 1회 | 90일 | 볼륨 스냅샷 |

### 2.3 Milvus (Vector DB)

| 백업 유형 | 주기 | 보관 기간 | 방법 |
|----------|------|----------|------|
| **Full Backup** | 주 1회 | 30일 | Collection Export |
| **etcd Backup** | 매일 | 7일 | `etcdctl snapshot` |

### 2.4 GitLab

| 백업 유형 | 주기 | 보관 기간 | 방법 |
|----------|------|----------|------|
| **Full Backup** | 매일 04:00 AM | 60일 | `gitlab-rake gitlab:backup:create` |

---

## 3. 백업 스크립트

### 3.1 PostgreSQL 백업

```bash
#!/bin/bash
# backup-postgres.sh

BACKUP_DIR="/backup/postgres"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/erp_backup_$TIMESTAMP.sql.gz"

# 전체 데이터베이스 백업
docker exec erp-postgres pg_dumpall -U postgres | gzip > $BACKUP_FILE

# 30일 이상 된 백업 삭제
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

echo "Backup completed: $BACKUP_FILE"
```

**Cron 설정 (매일 02:00 AM)**:
```cron
0 2 * * * /path/to/backup-postgres.sh >> /var/log/backup-postgres.log 2>&1
```

### 3.2 MinIO 백업

```bash
#!/bin/bash
# backup-minio.sh

SOURCE_ALIAS="local-minio"
TARGET_ALIAS="backup-s3"  # 또는 로컬 경로
BUCKET_NAME="erp-documents"

# MinIO Client (mc) 사용
mc mirror $SOURCE_ALIAS/$BUCKET_NAME $TARGET_ALIAS/minio-backup/$(date +%Y%m%d)

# 30일 이상 된 백업 삭제
# (S3 Lifecycle Policy 또는 수동 삭제)
```

### 3.3 Milvus 백업 (Collection Export)

```python
# backup_milvus.py
from pymilvus import connections, utility
import os
from datetime import datetime

# Milvus 연결
connections.connect("default", host="erp-milvus", port="19530")

# Collection 목록 가져오기
collections = utility.list_collections()

# 백업 디렉토리
backup_dir = f"/backup/milvus/{datetime.now().strftime('%Y%m%d_%H%M%S')}"
os.makedirs(backup_dir, exist_ok=True)

# 각 Collection Export (데이터 덤프)
for collection_name in collections:
    # Collection 데이터 Export (실제로는 파일 시스템 백업 권장)
    # Milvus는 etcd + MinIO 데이터를 백업하는 것이 표준
    pass

print(f"Milvus backup completed: {backup_dir}")
```

**참고**: Milvus는 `etcd` 백업 + `MinIO` 백업으로 완전 복구 가능합니다.

### 3.4 GitLab 백업

```bash
#!/bin/bash
# backup-gitlab.sh

BACKUP_DIR="/backup/gitlab"

# GitLab Backup 실행
docker exec ops-gitlab gitlab-rake gitlab:backup:create

# 백업 파일 외부 저장소로 복사
docker cp ops-gitlab:/var/opt/gitlab/backups/. $BACKUP_DIR/

# 60일 이상 된 백업 삭제
find $BACKUP_DIR -name "*.tar" -mtime +60 -delete
```

---

## 4. 백업 저장 위치

### 4.1 로컬 백업 (1차)
```
/backup/
├── postgres/
│   └── erp_backup_YYYYMMDD_HHMMSS.sql.gz
├── minio/
│   └── YYYYMMDD/
├── milvus/
│   └── YYYYMMDD_HHMMSS/
└── gitlab/
    └── TIMESTAMP_gitlab_backup.tar
```

### 4.2 오프사이트 백업 (2차)
- **클라우드 스토리지**: AWS S3, Google Cloud Storage
- **NAS**: 사내 네트워크 스토리지
- **원격 서버**: rsync를 통한 원격 동기화

---

## 5. 복구 절차 (Disaster Recovery)

### 5.1 PostgreSQL 복구

```bash
# 1. 백업 파일 압축 해제
gunzip /backup/postgres/erp_backup_YYYYMMDD_HHMMSS.sql.gz

# 2. 데이터베이스 복구
docker exec -i erp-postgres psql -U postgres < /backup/postgres/erp_backup_YYYYMMDD_HHMMSS.sql

# 3. 서비스 재시작
docker-compose restart
```

### 5.2 MinIO 복구

```bash
# mc mirror 명령으로 복구
mc mirror backup-s3/minio-backup/YYYYMMDD local-minio/erp-documents
```

### 5.3 Milvus 복구

1. **etcd 복구**:
   ```bash
   etcdctl snapshot restore /backup/milvus/etcd-snapshot.db
   ```

2. **MinIO 데이터 복구**: Milvus용 MinIO 버킷 복원

3. **Milvus 재시작**: 데이터 자동 로드

### 5.4 GitLab 복구

```bash
# 1. 백업 파일을 GitLab 컨테이너로 복사
docker cp /backup/gitlab/TIMESTAMP_gitlab_backup.tar ops-gitlab:/var/opt/gitlab/backups/

# 2. GitLab 복구 실행
docker exec ops-gitlab gitlab-rake gitlab:backup:restore BACKUP=TIMESTAMP
```

---

## 6. 백업 모니터링 및 알림

### 6.1 백업 실패 알림
- 백업 스크립트 종료 코드 확인
- 실패 시 Slack/Email 알림 전송

### 6.2 백업 무결성 검증
- 주 1회 랜덤 백업 파일 선택하여 복구 테스트
- 복구 성공 여부 로그 기록

---

## 7. RPO/RTO 정의

| 서비스 | RPO (복구 시점 목표) | RTO (복구 시간 목표) |
|---------|---------------------|---------------------|
| PostgreSQL | 6시간 | 2시간 |
| MinIO | 24시간 | 4시간 |
| Milvus | 7일 | 4시간 |
| GitLab | 24시간 | 2시간 |

**RPO**: 데이터 손실 허용 범위 (Recovery Point Objective)  
**RTO**: 서비스 복구 목표 시간 (Recovery Time Objective)

---

## 8. 백업 체크리스트

- [ ] 매일 PostgreSQL 백업 실행 확인
- [ ] 매주 백업 복구 테스트 수행
- [ ] 매월 오프사이트 백업 무결성 검증
- [ ] 분기별 전체 시스템 DR 훈련
