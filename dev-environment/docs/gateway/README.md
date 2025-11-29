# Nginx Gateway (erp-gateway)

## 1. 서비스 역할 (Service Role)
**Nginx Gateway**는 외부 요청을 내부 서비스로 연결해주는 **리버스 프록시(Reverse Proxy)**입니다.
- 단일 진입점(Entrypoint) 제공 (Port 80, 443)
- 도메인 기반 라우팅 (예: `api.all-erp.local` -> 백엔드 서비스)

## 2. 정상 작동 확인 (Verification)

### 상태 확인
```bash
docker ps | grep erp-gateway
```

### 로그 확인
```bash
docker logs erp-gateway --tail 20
```

## 3. 사용 가이드 (Usage Guide)

### 접속 정보
- **HTTP**: `80`
- **HTTPS**: `443`

### 설정
- 설정 파일: `dev-environment/config/nginx/nginx.conf`
- 새로운 서비스를 추가하거나 라우팅 규칙을 변경하려면 위 파일을 수정하고 재시작해야 합니다.
- **주의**: 연결된 업스트림 서비스(예: `erp-auth`)가 실행 중이지 않으면 Nginx가 시작되지 않을 수 있습니다.
