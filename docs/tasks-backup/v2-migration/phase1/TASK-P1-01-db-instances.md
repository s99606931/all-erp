# TASK-P1-01: DB 인스턴스 생성 및 스키마 설계

## 📋 작업 개요
- **Phase**: Phase 1 (Database 분리)
- **예상 시간**: 1주
- **우선순위**: High
- **선행 작업**: 없음

## 🎯 목표

단일 PostgreSQL 컨테이너 내에 17개의 독립적인 데이터베이스를 생성하고, 각 서비스별 데이터 모델을 설계합니다.

**전략**: 리소스 효율성을 위해 PostgreSQL 컨테이너는 1개만 사용하되, 논리적으로 17개의 독립 데이터베이스를 분리합니다.

## 📝 상세 작업 내용

### 1. Docker Compose 파일 작성

`dev-environment/docker-compose.infra.yml`의 기존 PostgreSQL 서비스 활용:

```yaml
services:
  # PostgreSQL 단일 컨테이너 (17개 독립 데이터베이스 포함)
  postgres:
    image: postgres:17-alpine
    container_name: all-erp-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${DB_USERNAME:-postgres}
      POSTGRES_PASSWORD: ${DB_PASSWORD:-devpassword123}
      POSTGRES_DB: ${DB_DATABASE:-all_erp}  # 기본 DB
      TZ: ${TZ:-Asia/Seoul}
    ports:
      - "${DB_PORT:-5432}:5432"
    volumes:
      - ./volumes/postgres:/var/lib/postgresql/data
      - ./config/postgres/init.sql:/docker-entrypoint-initdb.d/init.sql:ro
    networks:
      - all-erp-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USERNAME:-postgres}"]
      interval: 10s
      timeout: 5s
      retries: 5

  # MongoDB (ai-service용)
  mongo:
    image: mongo:7
    container_name: all-erp-mongo
    environment:
      MONGO_INITDB_DATABASE: ai_db
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_USERNAME:-mongo}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_PASSWORD:-devpassword123}
    ports:
      - "27017:27017"
    volumes:
      - ./volumes/mongo:/data/db
    networks:
      - all-erp-network
```

### 2. PostgreSQL 초기화 스크립트

`dev-environment/config/postgres/init.sql`에서 17개 데이터베이스 생성:

```sql
-- 16개 서비스용 PostgreSQL 데이터베이스
CREATE DATABASE auth_db;
CREATE DATABASE system_db;
CREATE DATABASE tenant_db;
CREATE DATABASE personnel_db;
CREATE DATABASE payroll_db;
CREATE DATABASE attendance_db;
CREATE DATABASE budget_db;
CREATE DATABASE accounting_db;
CREATE DATABASE settlement_db;
CREATE DATABASE asset_db;
CREATE DATABASE supply_db;
CREATE DATABASE general_affairs_db;
CREATE DATABASE approval_db;
CREATE DATABASE report_db;
CREATE DATABASE notification_db;
CREATE DATABASE file_db;

-- 필요 시 각 DB별 사용자 생성 및 권한 부여 가능
-- CREATE USER auth_user WITH PASSWORD 'password';
-- GRANT ALL PRIVILEGES ON DATABASE auth_db TO auth_user;
```

### 3. 서비스별 데이터베이스 목록

**PostgreSQL 컨테이너**: `all-erp-postgres` (포트: 5432)

| 서비스 | DB 이름 | 연결 문자열 예시 |
|--------|---------|------------------|
| auth-service | auth_db | postgresql://postgres:devpassword123@localhost:5432/auth_db |
| system-service | system_db | postgresql://postgres:devpassword123@localhost:5432/system_db |
| tenant-service | tenant_db | postgresql://postgres:devpassword123@localhost:5432/tenant_db |
| personnel-service | personnel_db | postgresql://postgres:devpassword123@localhost:5432/personnel_db |
| payroll-service | payroll_db | postgresql://postgres:devpassword123@localhost:5432/payroll_db |
| attendance-service | attendance_db | postgresql://postgres:devpassword123@localhost:5432/attendance_db |
| budget-service | budget_db | postgresql://postgres:devpassword123@localhost:5432/budget_db |
| accounting-service | accounting_db | postgresql://postgres:devpassword123@localhost:5432/accounting_db |
| settlement-service | settlement_db | postgresql://postgres:devpassword123@localhost:5432/settlement_db |
| asset-service | asset_db | postgresql://postgres:devpassword123@localhost:5432/asset_db |
| supply-service | supply_db | postgresql://postgres:devpassword123@localhost:5432/supply_db |
| general-affairs-service | general_affairs_db | postgresql://postgres:devpassword123@localhost:5432/general_affairs_db |
| approval-service | approval_db | postgresql://postgres:devpassword123@localhost:5432/approval_db |
| report-service | report_db | postgresql://postgres:devpassword123@localhost:5432/report_db |
| notification-service | notification_db | postgresql://postgres:devpassword123@localhost:5432/notification_db |
| file-service | file_db | postgresql://postgres:devpassword123@localhost:5432/file_db |

**MongoDB 컨테이너**: `all-erp-mongo` (포트: 27017)

| 서비스 | DB 이름 | 연결 문자열 예시 |
|--------|---------|------------------|
| ai-service | ai_db | mongodb://mongo:password@localhost:27017/ai_db |

### 4. 데이터 모델 분석

각 서비스가 소유할 테이블 정의:

**auth-service (auth_db)**:
- users
- roles
- permissions
- user_roles
- refresh_tokens

**personnel-service (personnel_db)**:
- employees
- departments
- positions
- employee_history

**payroll-service (payroll_db)**:
- payrolls
- salary_items
- deductions
- payroll_history

(나머지 서비스도 동일하게 정의)

### 4. 공통 테이블 규칙

모든 테이블에 포함되어야 하는 공통 컬럼:
```sql
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
deleted_at TIMESTAMP  -- Soft Delete
tenant_id INTEGER NOT NULL  -- 멀티테넌시
```

## ✅ 완료 조건

- [ ] `docker-compose.infra.yml` PostgreSQL 서비스 확인
- [ ] `config/postgres/init.sql` 파일에 17개 DB 생성 스크립트 작성
- [ ] PostgreSQL 컨테이너 정상 실행 확인
- [ ] 17개 독립 데이터베이스 생성 확인
- [ ] 각 DB에 연결 가능 확인 (psql)
- [ ] MongoDB 컨테이너 정상 실행 확인
- [ ] 서비스별 데이터 모델 문서화 (`docs/architecture/data-models.md`)

## 🔧 실행 명령어

```bash
cd dev-environment

# 인프라 서비스 실행 (PostgreSQL, MongoDB, Redis, RabbitMQ 등)
docker compose -f docker-compose.infra.yml up -d

# PostgreSQL 컨테이너 확인
docker ps | grep all-erp-postgres

# 17개 데이터베이스 생성 확인
docker exec -it all-erp-postgres psql -U postgres -c "\l"

# 특정 DB 연결 테스트
docker exec -it all-erp-postgres psql -U postgres -d auth_db
docker exec -it all-erp-postgres psql -U postgres -d system_db

# MongoDB 연결 테스트
docker exec -it all-erp-mongo mongosh -u mongo -p devpassword123 --authenticationDatabase admin
```

## 📚 참고 문서

- [README-MICROSERVICES-PLAN.md](file:///data/all-erp/docs/README-MICROSERVICES-PLAN.md)
- [Database per Service 가이드](file:///data/all-erp/docs/architecture/database-per-service-guide.md)
- [DB 설계 가이드](file:///data/all-erp/docs/human/db_design_guide.md)

## 🚨 주의사항

- **단일 PostgreSQL 컨테이너**: 리소스 효율성을 위해 컨테이너는 1개만 사용
- **논리적 격리**: 각 서비스는 독립된 데이터베이스를 사용하여 데이터 격리
- **연결 문자열**: 모든 서비스가 같은 호스트:포트를 사용하되, 데이터베이스명만 다름
- **보안**: 프로덕션 환경에서는 각 서비스별 사용자 계정 생성 권장
- **볼륨 마운트**: 데이터 영속성 보장
- **환경 변수**: .env 파일로 비밀번호 관리
