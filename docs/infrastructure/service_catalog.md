# 서비스 아키텍처 및 인프라 구성도 (Service Architecture & Infrastructure)

본 문서는 **Docker Compose** 환경을 기준으로 전체 시스템의 서비스 구성, 도메인 정책, 포트 매핑 및 기술 스택을 정의합니다.

## 1. 도메인 및 네트워크 정책 (Domain Policy)

로컬 개발 및 온프레미스 운영 시 다음과 같은 도메인 규칙을 따릅니다. 로컬 환경에서는 `hosts` 파일 설정이 필요합니다.

- **Root Domain**: `all-erp.local`
- **Service Domain**: `*.all-erp.local` (서브도메인 라우팅)
- **Tenant Domain**: `{tenant_id}.all-erp.local` (SaaS 멀티테넌시)

| 구분 | 도메인 (URL) | 설명 |
|------|-------------|------|
| **Main App** | `https://app.all-erp.local` | 통합 웹 어드민 (Frontend) |
| **API Gateway** | `https://api.all-erp.local` | 백엔드 API 진입점 |
| **GitLab** | `https://gitlab.all-erp.local` | 소스코드 저장소 및 CI/CD |
| **Registry** | `https://registry.all-erp.local` | 컨테이너 레지스트리 |
| **Monitoring** | `https://monitor.all-erp.local` | Grafana 대시보드 |
| **Tracing** | `https://trace.all-erp.local` | Jaeger UI |
| **Logging** | `https://logs.all-erp.local` | Kibana |

---

## 2. 서비스 카탈로그 (Service Catalog)

### 2.1 ERP 마이크로서비스 (Backend)

대부분의 백엔드 서비스는 **NestJS (Node.js 22)** 기반이며, **Prisma ORM**을 사용합니다.
AI 관련 서비스는 **Python/FastAPI** 기반으로 구성됩니다.

| 서비스명 (Service Name) | 컨테이너명 (Container Name) | 호스트 포트 | 내부 포트 | 기술 스택 | 설명 |
|------------------------|---------------------------|-----------|----------|----------|------|
| `auth-service` | `erp-auth` | `3001` | `3001` | NestJS, Passport | 인증/인가, JWT 발급 |
| `system-service` | `erp-system` | `3002` | `3002` | NestJS | 공통 코드, 조직 관리 |
| `tenant-service` | `erp-tenant` | `3006` | `3006` | NestJS | 테넌트 구독 및 설정 |
| `ai-service` | `erp-ai` | `8000` | `8000` | **Python, FastAPI** | AI 챗봇, OCR, 이상탐지 (RAG) |
| `llm-service` | `erp-llm` | `8001` | `8001` | **vLLM (GPU)** | 오픈소스 LLM 서빙 (OpenAI API 호환) |
| `personnel-service` | `erp-personnel` | `3011` | `3011` | NestJS | 인사 관리 |
| `payroll-service` | `erp-payroll` | `3012` | `3012` | NestJS | 급여 계산 |
| `attendance-service` | `erp-attendance` | `3013` | `3013` | NestJS | 근태/휴가 관리 |
| `budget-service` | `erp-budget` | `3021` | `3021` | NestJS | 예산 관리 |
| `accounting-service` | `erp-accounting` | `3022` | `3022` | NestJS | 재무 회계 |
| `settlement-service` | `erp-settlement` | `3023` | `3023` | NestJS | 결산 관리 |
| `asset-service` | `erp-asset` | `3031` | `3031` | NestJS | 자산 관리 |
| `supply-service` | `erp-supply` | `3032` | `3032` | NestJS | 물품 관리 |
| `general-affairs-service` | `erp-general` | `3033` | `3033` | NestJS | 총무 관리 |

### 2.2 프론트엔드 (Frontend)

| 서비스명 | 컨테이너명 | 호스트 포트 | 내부 포트 | 기술 스택 | 설명 |
|---------|-----------|-----------|----------|----------|------|
| `web-admin` | `erp-web-admin` | `4200` | `4200` | Next.js 15, React | 통합 관리자 웹 콘솔 |

### 2.3 인프라스트럭처 (Infrastructure)

| 서비스명 | 컨테이너명 | 호스트 포트 | 내부 포트 | 기술 스택 | 설명 |
|---------|-----------|-----------|----------|----------|------|
| `postgres` | `erp-postgres` | `5432` | `5432` | PostgreSQL 16 | 메인 데이터베이스 (Schema per Tenant) |
| `redis` | `erp-redis` | `6379` | `6379` | Redis 7 | 캐시, 세션, 큐 관리 |
| `rabbitmq` | `erp-rabbitmq` | `5672`<br>`15672` | `5672`<br>`15672` | RabbitMQ 3.12 | 메시지 브로커 (이벤트 버스) |
| `milvus` | `erp-milvus` | `19530`<br>`9091` | `19530`<br>`9091` | Milvus 2.3 | Vector DB (RAG) |
| `etcd` | `erp-etcd` | - | `2379` | etcd 3.5 | Milvus 메타데이터 저장소 |
| `minio` | `erp-minio` | `9000`<br>`9001` | `9000`<br>`9001` | MinIO | Milvus 객체 저장소 |
| `gateway` | `erp-gateway` | `80`<br>`443` | `80`<br>`443` | Nginx / Kong | API 게이트웨이 및 리버스 프록시 |

### 2.4 DevOps 및 모니터링 (Ops)

*주의: 로컬 개발 시 포트 충돌 방지를 위해 GitLab 등 일부 서비스의 호스트 포트는 조정될 수 있습니다.*

| 서비스명 | 컨테이너명 | 호스트 포트 | 내부 포트 | 기술 스택 | 설명 |
|---------|-----------|-----------|----------|----------|------|
| `gitlab` | `ops-gitlab` | `8980` (Web)<br>`8922` (SSH)<br>`5050` (Reg) | `80`<br>`22`<br>`5050` | GitLab CE | 소스코드, CI/CD, Registry |
| `gitlab-runner` | `ops-runner` | - | - | Go | CI/CD Job 실행기 |
| `prometheus` | `ops-prometheus` | `9090` | `9090` | Prometheus | 메트릭 수집 |
| `grafana` | `ops-grafana` | `3000` | `3000` | Grafana | 모니터링 대시보드 |
| `elasticsearch` | `ops-elasticsearch` | `9200` | `9200` | Elasticsearch | 로그 저장소 |
| `kibana` | `ops-kibana` | `5601` | `5601` | Kibana | 로그 시각화 |
| `logstash` | `ops-logstash` | `5044` | `5044` | Logstash | 로그 수집 파이프라인 |
| `jaeger` | `ops-jaeger` | `16686` (UI)<br>`14268` (Collector) | `16686`<br>`14268` | Jaeger | 분산 트레이싱 |

---

## 3. Docker Compose 네트워크 구성

모든 컨테이너는 `erp-network`라는 Docker Bridge Network를 공유하여 서로 통신합니다.

```yaml
networks:
  all-erp-network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16
```

### 내부 통신 예시
- **API Gateway → Auth Service**: `http://erp-auth:3001`
- **Auth Service → DB**: `postgresql://postgres:password@erp-postgres:5432/erp`
- **AI Service → LLM Service**: `http://erp-llm:8001/v1/chat/completions` (OpenAI API 호환)
- **AI Service → Milvus**: `http://erp-milvus:19530`
- **Web Admin → API Gateway**: `http://erp-gateway:80` (Server-side Fetch)

---

## 4. 기술 스택 요약 (Tech Stack Summary)

### Backend
- **Framework**: NestJS (Node.js 22 LTS), **FastAPI (Python 3.12)**
- **Language**: TypeScript 5.x, **Python 3.12**
- **ORM**: Prisma (Node), **SQLAlchemy/Pydantic (Python)**
- **Documentation**: Swagger (OpenAPI 3.0)
- **Test**: Jest (Unit), Supertest (E2E)

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS
- **Components**: Shadcn/UI (Radix UI 기반)
- **State**: Zustand (Client), TanStack Query (Server)
- **Form**: React Hook Form + Zod

### Data & Infra
- **DB**: PostgreSQL 16 (Multi-schema)
- **Cache**: Redis 7
- **Broker**: RabbitMQ 3.12
- **Container**: Docker, Docker Compose
- **Orchestration**: Kubernetes (Production)

### AI
- **LLM Integration**: LangChain (Python)
- **Vector DB**: Milvus (Self-hosted)
- **Model Serving**: **vLLM** (OpenAI Compatible API)
- **Model**: **Hugging Face Open LLM** (e.g., Llama 3, Mistral)

---

## 5. 하드웨어 요구사항 (Hardware Requirements)

### 개발 환경 (Dev)
- **CPU**: 8 Core 이상
- **RAM**: 16GB 이상 (Docker 환경)
- **Disk**: 100GB SSD 이상

### GPU 서버 (LLM Serving)
- **GPU**: NVIDIA GPU (VRAM 24GB+ 권장, e.g., RTX 3090, A100)
- **RAM**: 32GB 이상
- **Disk**: 200GB SSD (모델 저장)
- **Driver**: NVIDIA Driver 525+ 및 CUDA 12+
- **Runtime**: NVIDIA Container Toolkit 설치 필수

### 운영 환경 (Production)
- **Kubernetes Cluster**: 최소 3 Node (Master 1, Worker 2+)
- **각 Node**: 16 Core, 64GB RAM, 500GB SSD
- **Load Balancer**: Nginx/Kong (또는 클라우드 LB)
