# 스케일링 정책 (Scaling Policy)

본 문서는 ALL-ERP 시스템의 수평 확장(Horizontal Scaling) 및 수직 확장(Vertical Scaling) 전략을 정의합니다.

## 1. 스케일링 유형

### 1.1 수평 확장 (Horizontal Scaling)
- 서비스 인스턴스 수를 늘려 부하 분산
- Kubernetes ReplicaSet 또는 Docker Compose Scale 사용

### 1.2 수직 확장 (Vertical Scaling)
- 단일 인스턴스의 CPU/메모리 증설
- 컨테이너 리소스 제한 조정

---

## 2. 서비스별 스케일링 전략

### 2.1 Stateless 서비스 (수평 확장 가능)

#### Backend API 서비스
| 서비스 | 최소 인스턴스 | 최대 인스턴스 | 스케일 조건 |
|---------|-------------|-------------|-----------|
| `auth-service` | 2 | 10 | CPU > 70% 또는 RPS > 500 |
| `system-service` | 2 | 5 | CPU > 70% |
| `hr/finance/general` | 1 | 5 | CPU > 80% |

**Kubernetes HPA 설정 예시**:
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: auth-service-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: auth-service
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

#### Frontend 서비스
| 서비스 | 최소 인스턴스 | 최대 인스턴스 | 스케일 조건 |
|---------|-------------|-------------|-----------|
| `web-admin` | 2 | 8 | CPU > 60% 또는 동시 사용자 > 500 |

### 2.2 Stateful 서비스 (수평 확장 제한적)

#### PostgreSQL
- **권장**: Master-Slave Replication (Read Replica)
- **수평 확장**: Read 트래픽을 Slave로 분산
- **수직 확장**: Write 부하가 높을 경우 Master 리소스 증설

```yaml
# StatefulSet 예시 (Primary + Replica)
replicas: 3  # 1 Primary + 2 Read Replicas
```

#### Redis
- **권장**: Redis Cluster 또는 Sentinel 모드
- **수평 확장**: Sharding을 통한 데이터 분산
- **수직 확장**: 메모리 증설

#### Milvus
- **권장**: Cluster 모드 (Coordinator, Query Node, Data Node 분리)
- **수평 확장**: Query Node 추가로 검색 성능 향상

---

## 3. AI 서비스 스케일링

### 3.1 ai-service (FastAPI)
- **수평 확장**: 가능 (Stateless)
- **최소 인스턴스**: 2
- **최대 인스턴스**: 5
- **스케일 조건**: CPU > 70% 또는 Queue Length > 100

### 3.2 llm-service (vLLM)
- **수평 확장**: GPU당 1 인스턴스
- **수직 확장**: 더 큰 GPU 사용 (A100 → H100)
- **멀티 GPU**: `TENSOR_PARALLEL_SIZE` 증가

**참고**: LLM 서비스는 GPU 메모리가 제약이므로 수직 확장이 주요 전략입니다.

---

## 4. 로드 밸런싱 전략

### 4.1 API Gateway 레벨
- **툴**: Nginx / Kong
- **알고리즘**: Round Robin (기본), Least Connections (권장)

**Nginx 설정 예시**:
```nginx
upstream auth-service {
    least_conn;
    server erp-auth-1:3001;
    server erp-auth-2:3001;
    server erp-auth-3:3001;
}

server {
    listen 80;
    location /api/auth {
        proxy_pass http://auth-service;
    }
}
```

### 4.2 Database Connection Pooling
- **Prisma**: `connection_limit` 설정
- **권장값**: 인스턴스당 10 connections, 전체 합이 DB `max_connections`의 80%를 넘지 않도록

```typescript
// Prisma Client 설정
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  // Connection Pool 설정
  // connection_limit=10
});
```

---

## 5. Kubernetes 환경에서의 자동 스케일링

### 5.1 HPA (Horizontal Pod Autoscaler)
- CPU 기반 스케일링: 70% 임계치
- 메모리 기반 스케일링: 80% 임계치
- Custom Metrics: RPS, Queue Length

### 5.2 VPA (Vertical Pod Autoscaler)
- 리소스 요청/제한 자동 조정
- AI 서비스 등 리소스 요구량이 가변적인 서비스에 유용

### 5.3 Cluster Autoscaler
- Node 부족 시 자동으로 클러스터 확장
- 클라우드 환경에서 활용

---

## 6. 성능 테스트 및 임계치 설정

### 6.1 부하 테스트 (k6)

```javascript
// k6 스크립트 예시
import http from 'k6/http';
import { check } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 100 },  // Ramp-up
    { duration: '5m', target: 500 },  // Stay at 500 RPS
    { duration: '2m', target: 0 },    // Ramp-down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],  // 95% 요청이 500ms 이하
    http_req_failed: ['rate<0.01'],    // 실패율 1% 미만
  },
};

export default function () {
  let res = http.get('https://api.all-erp.local/health');
  check(res, { 'status is 200': (r) => r.status === 200 });
}
```

### 6.2 임계치 설정 기준

| 지표 | 목표 | 경고 | 위험 |
|------|------|------|------|
| **CPU 사용률** | < 50% | 70% | 85% |
| **메모리 사용률** | < 60% | 80% | 90% |
| **응답 시간 (P95)** | < 300ms | 500ms | 1000ms |
| **에러율** | < 0.1% | 0.5% | 1% |

---

## 7. 비용 최적화 전략

### 7.1 Auto Scaling Down
- 트래픽 감소 시 자동으로 인스턴스 축소
- 최소 인스턴스 수 유지 (고가용성 보장)

### 7.2 Spot Instances (클라우드)
- Non-critical 워크로드에 Spot Instance 활용
- 비용 최대 70% 절감

### 7.3 Right Sizing
- 주기적으로 리소스 사용량 분석
- 과도하게 할당된 리소스 조정

---

## 8. 스케일링 모니터링

### 8.1 Grafana 대시보드
- 실시간 인스턴스 수 모니터링
- CPU/메모리 사용률 추적
- Auto Scaling 이벤트 로그

### 8.2 알림 설정
- HPA 스케일 업/다운 시 Slack 알림
- 최대 인스턴스 도달 시 경고

---

## 9. 스케일링 체크리스트

- [ ] 모든 Stateless 서비스에 HPA 설정
- [ ] Database Read Replica 구성
- [ ] Connection Pool 최적화
- [ ] 월 1회 부하 테스트 수행
- [ ] 분기별 스케일링 정책 검토
