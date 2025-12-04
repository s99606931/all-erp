# TASK-P1-01: DB 인스턴스 생성 및 스키마 설계

## 📋 작업 개요
- **Phase**: Phase 1 (Database 분리)
- **예상 시간**: 1주
- **우선순위**: High
- **선행 작업**: 없음

## 🎯 목표

17개의 독립적인 데이터베이스 인스턴스를 생성하고, 각 서비스별 데이터 모델을 설계합니다.

## 📝 상세 작업 내용

### 1. Docker Compose 파일 작성

`dev-environment/docker-compose.infra.yml`에 17개 DB 인스턴스 정의:

```yaml
services:
  # PostgreSQL 인스턴스 (16개)
  postgres-auth:
    image: postgres:16-alpine
    container_name: postgres-auth
    environment:
      POSTGRES_DB: auth_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres-auth-data:/var/lib/postgresql/data

  postgres-system:
    image: postgres:16-alpine
    container_name: postgres-system
    environment:
      POSTGRES_DB: system_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5433:5432"
    volumes:
      - postgres-system-data:/var/lib/postgresql/data

  # ... 나머지 14개 DB 인스턴스도 동일한 패턴으로 작성

  # MongoDB 인스턴스 (ai-service용)
  mongo-ai:
    image: mongo:7
    container_name: mongo-ai
    environment:
      MONGO_INITDB_DATABASE: ai_db
      MONGO_INITDB_ROOT_USERNAME: mongo
      MONGO_INITDB_ROOT_PASSWORD: password
    ports:
      - "27017:27017"
    volumes:
      - mongo-ai-data:/data/db

volumes:
  postgres-auth-data:
  postgres-system-data:
  # ... 나머지 볼륨 정의
```

### 2. 서비스별 DB 인스턴스 목록

| 서비스 | DB 이름 | 포트 | 타입 |
|--------|---------|------|------|
| auth-service | auth_db | 5432 | PostgreSQL |
| system-service | system_db | 5433 | PostgreSQL |
| tenant-service | tenant_db | 5434 | PostgreSQL |
| personnel-service | personnel_db | 5435 | PostgreSQL |
| payroll-service | payroll_db | 5436 | PostgreSQL |
| attendance-service | attendance_db | 5437 | PostgreSQL |
| budget-service | budget_db | 5438 | PostgreSQL |
| accounting-service | accounting_db | 5439 | PostgreSQL |
| settlement-service | settlement_db | 5440 | PostgreSQL |
| asset-service | asset_db | 5441 | PostgreSQL |
| supply-service | supply_db | 5442 | PostgreSQL |
| general-affairs-service | general_affairs_db | 5443 | PostgreSQL |
| approval-service | approval_db | 5444 | PostgreSQL |
| report-service | report_db | 5445 | PostgreSQL |
| notification-service | notification_db | 5446 | PostgreSQL |
| file-service | file_db | 5447 | PostgreSQL |
| ai-service | ai_db | 27017 | MongoDB |

### 3. 데이터 모델 분석

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

- [ ] `docker-compose.infra.yml` 파일 작성 완료
- [ ] 17개 DB 인스턴스 정상 실행 확인
- [ ] 각 DB에 연결 가능 확인 (psql, MongoDB Compass)
- [ ] 서비스별 데이터 모델 문서화 (`docs/architecture/data-models.md`)
- [ ] RabbitMQ, Redis, Minio도 함께 설정

## 🔧 실행 명령어

```bash
cd dev-environment
docker compose -f docker-compose.infra.yml up -d

# DB 연결 확인
docker exec -it postgres-auth psql -U postgres -d auth_db
docker exec -it mongo-ai mongo -u mongo -p password
```

## 📚 참고 문서

- [README-MICROSERVICES-PLAN.md](file:///data/all-erp/docs/README-MICROSERVICES-PLAN.md)
- [Database per Service 가이드](file:///data/all-erp/docs/architecture/database-per-service-guide.md)
- [DB 설계 가이드](file:///data/all-erp/docs/human/db_design_guide.md)

## 🚨 주의사항

- 각 DB 인스턴스는 독립적인 포트 사용
- 볼륨 마운트로 데이터 영속성 보장
- 환경별로 다른 비밀번호 사용 (.env 파일로 관리)
- 로컬 개발 환경에서는 모든 DB를 한 번에 실행
