# Logstash (ops-logstash)

## 1. 서비스 역할 (Service Role)
**Logstash**는 **서버 측 데이터 처리 파이프라인**입니다.
- 다양한 소스에서 데이터를 수집하여 변환한 후 Elasticsearch 등으로 전송합니다.
- 본 프로젝트에서는 애플리케이션 로그를 수집하는 역할을 합니다.

## 2. 정상 작동 확인 (Verification)

### 상태 확인
```bash
docker ps | grep ops-logstash
```

### 로그 확인
```bash
docker logs ops-logstash --tail 20
```

## 3. 사용 가이드 (Usage Guide)

### 접속 정보
- **Port**: `5044` (Beats 입력용)

### 파이프라인 설정
- 설정 파일 위치: `dev-environment/config/logstash/pipeline`
- `logstash.conf` 파일을 수정하여 입력(Input), 필터(Filter), 출력(Output)을 정의할 수 있습니다.
