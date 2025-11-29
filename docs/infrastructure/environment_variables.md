# 환경 변수 가이드 (Environment Variables Guide)

본 문서는 ALL-ERP 시스템의 각 서비스별 필수 환경 변수와 권장 설정값을 정의합니다.

## 1. 공통 환경 변수

모든 서비스에서 공통으로 사용하는 환경 변수입니다.

```bash
# 애플리케이션 환경
NODE_ENV=development          # development | production | test
LOG_LEVEL=info               # debug | info | warn | error

# 타임존
TZ=Asia/Seoul
```

---

## 2. Backend 서비스 (NestJS)

### 2.1 auth-service

```bash
# JWT 설정
JWT_SECRET=your-super-secret-key-change-in-production-min-32-chars
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_SECRET=your-refresh-token-secret-min-32-chars
REFRESH_TOKEN_EXPIRES_IN=7d

# 데이터베이스
DATABASE_URL=postgresql://postgres:password@erp-postgres:5432/erp

# Redis (세션 관리)
REDIS_URL=redis://erp-redis:6379

# 포트
PORT=3001
```

### 2.2 system-service, tenant-service

```bash
DATABASE_URL=postgresql://postgres:password@erp-postgres:5432/erp
REDIS_URL=redis://erp-redis:6379
PORT=3002  # system-service
# PORT=3006  # tenant-service
```

### 2.3 HR/Finance/General Domain 서비스

```bash
DATABASE_URL=postgresql://postgres:password@erp-postgres:5432/erp
RABBITMQ_URL=amqp://guest:guest@erp-rabbitmq:5672
REDIS_URL=redis://erp-redis:6379
PORT=3011  # 서비스별로 변경 (3011-3033)
```

---

## 3. AI 서비스 (Python/FastAPI)

### 3.1 ai-service

```bash
# FastAPI 설정
PORT=8000
HOST=0.0.0.0

# LLM 연동
LLM_SERVICE_URL=http://erp-llm:8001
OPENAI_API_KEY=sk-...  # Fallback용 (선택)

# Milvus (Vector DB)
MILVUS_HOST=erp-milvus
MILVUS_PORT=19530
MILVUS_COLLECTION_NAME=erp_knowledge_base

# MinIO (문서 저장)
MINIO_ENDPOINT=erp-minio:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET_NAME=erp-documents

# OCR
GOOGLE_VISION_API_KEY=your-google-vision-api-key  # 또는 Tesseract 사용
```

### 3.2 llm-service (vLLM)

```bash
# vLLM 설정
PORT=8001
MODEL_NAME=meta-llama/Llama-3-8b-hf  # Hugging Face 모델명
GPU_MEMORY_UTILIZATION=0.9           # GPU 메모리 사용률 (0.9 = 90%)
MAX_MODEL_LEN=4096                   # 최대 컨텍스트 길이
TENSOR_PARALLEL_SIZE=1               # GPU 개수

# Hugging Face
HF_TOKEN=hf_...  # Hugging Face API 토큰 (Private 모델 접근 시)
```

---

## 4. Frontend (Next.js)

### 4.1 web-admin

```bash
# Next.js 설정
NEXT_PUBLIC_API_GATEWAY_URL=https://api.all-erp.local
NEXT_PUBLIC_APP_ENV=development

# 인증
NEXTAUTH_URL=https://app.all-erp.local
NEXTAUTH_SECRET=your-nextauth-secret-min-32-chars

# 포트
PORT=4200
```

---

## 5. 인프라 서비스

### 5.1 PostgreSQL

```bash
POSTGRES_USER=postgres
POSTGRES_PASSWORD=strong-password-here
POSTGRES_DB=erp
POSTGRES_MAX_CONNECTIONS=100
```

### 5.2 Redis

```bash
# Redis는 대부분 기본 설정 사용
# 비밀번호 설정 시:
# REDIS_PASSWORD=your-redis-password
```

### 5.3 RabbitMQ

```bash
RABBITMQ_DEFAULT_USER=admin
RABBITMQ_DEFAULT_PASS=strong-password-here
RABBITMQ_DEFAULT_VHOST=/
```

### 5.4 Milvus

```bash
# etcd
ETCD_AUTO_COMPACTION_MODE=revision
ETCD_AUTO_COMPACTION_RETENTION=1000

# MinIO (Milvus용)
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=minioadmin
```

---

## 6. DevOps 서비스

### 6.1 GitLab

```bash
GITLAB_ROOT_PASSWORD=initial-root-password
GITLAB_OMNIBUS_CONFIG=|
  external_url 'https://gitlab.all-erp.local'
  registry_external_url 'https://registry.all-erp.local'
```

### 6.2 Prometheus

```bash
# prometheus.yml 설정 파일로 관리
```

### 6.3 Grafana

```bash
GF_SECURITY_ADMIN_USER=admin
GF_SECURITY_ADMIN_PASSWORD=strong-password-here
GF_SERVER_ROOT_URL=https://monitor.all-erp.local
```

---

## 7. 환경별 설정 전략

### 7.1 로컬 개발 환경

- `.env.local` 파일 사용 (Git 무시)
- 기본값: `localhost` 또는 컨테이너명

### 7.2 스테이징 환경

- `.env.staging` 파일 또는 Kubernetes ConfigMap/Secret 사용
- 실제 도메인 사용 (e.g., `https://staging-api.all-erp.com`)

### 7.3 운영 환경

- **Kubernetes Secrets** 사용 (권장)
- 또는 **AWS Secrets Manager**, **HashiCorp Vault** 활용
- 민감 정보는 절대 Git에 커밋하지 않음

---

## 8. 보안 권장사항

1. **JWT Secret**: 최소 32자 이상, 알파벳+숫자+특수문자 조합
2. **Database Password**: 최소 16자 이상, 복잡한 조합
3. **API Keys**: 절대 코드에 하드코딩 금지, 환경 변수로만 관리
4. **Git 관리**: `.env.example` 파일만 Git에 포함, `.env`는 `.gitignore`에 추가

---

## 9. 환경 변수 검증

각 서비스 시작 시 필수 환경 변수가 설정되어 있는지 검증하는 로직을 추가해야 합니다.

### NestJS 예시 (Joi)
```typescript
import * as Joi from 'joi';

export default {
  validationSchema: Joi.object({
    NODE_ENV: Joi.string().valid('development', 'production', 'test').required(),
    DATABASE_URL: Joi.string().required(),
    JWT_SECRET: Joi.string().min(32).required(),
  }),
};
```

### FastAPI 예시 (Pydantic)
```python
from pydantic import BaseSettings, Field

class Settings(BaseSettings):
    port: int = Field(8000, env='PORT')
    llm_service_url: str = Field(..., env='LLM_SERVICE_URL')
    milvus_host: str = Field(..., env='MILVUS_HOST')
    
    class Config:
        env_file = '.env'
```
