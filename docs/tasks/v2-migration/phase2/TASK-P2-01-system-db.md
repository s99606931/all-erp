# TASK-P2-01: System 도메인 DB 연결

## 📋 작업 개요
- **Phase**: Phase 2 (서비스별 DB 연결 변경)
- **예상 시간**: 0.5주
- **우선순위**: High
- **선행 작업**: TASK-P1-04 (인프라 설정 완료)

## 🎯 목표

System 도메인(auth, system, tenant 서비스)의 DB 연결을 신규 독립 DB로 전환합니다.

## 📝 상세 작업 내용

### 1. auth-service 연결 변경

**apps/system/auth-service/.env**:
```bash
DATABASE_URL="postgresql://postgres:password@localhost:5432/auth_db"
REDIS_URL="redis://:password@localhost:6379"
RABBITMQ_URL="amqp://guest:guest@localhost:5672"
JWT_SECRET="your-secret-key"
```

**apps/system/auth-service/src/main.ts** (확인):
```typescript
import { bootstrapService } from '@all-erp/shared/infra';
import { AppModule } from './app/app.module';

async function bootstrap() {
  await bootstrapService({
    module: AppModule,
    serviceName: 'auth-service',
    port: 3001,
    swagger: {
      title: 'Auth Service API',
      description: '인증 및 인가 API',
      version: '1.0',
    },
  });
}

bootstrap();
```

### 2. system-service 연결 변경

**apps/system/system-service/.env**:
```bash
DATABASE_URL="postgresql://postgres:password@localhost:5433/system_db"
REDIS_URL="redis://:password@localhost:6379"
RABBITMQ_URL="amqp://guest:guest@localhost:5672"
```

### 3. tenant-service 연결 변경

**apps/system/tenant-service/.env**:
```bash
DATABASE_URL="postgresql://postgres:password@localhost:5434/tenant_db"
REDIS_URL="redis://:password@localhost:6379"
RABBITMQ_URL="amqp://guest:guest@localhost:5672"
```

### 4. Prisma 마이그레이션 실행

```bash
# auth-service
cd apps/system/auth-service
pnpm prisma migrate deploy
pnpm prisma generate

# system-service
cd ../system-service
pnpm prisma migrate deploy
pnpm prisma generate

# tenant-service
cd ../tenant-service
pnpm prisma migrate deploy
pnpm prisma generate
```

### 5. 서비스 실행 테스트

```bash
# Docker Compose로 실행
cd dev-environment
docker compose -f docker-compose.dev.yml up -d auth-service system-service tenant-service

# 헬스 체크
curl http://localhost:3001/health
curl http://localhost:3002/health
curl http://localhost:3006/health
```

## ✅ 완료 조건

- [ ] auth-service DB 연결 변경 및 테스트
- [ ] system-service DB 연결 변경 및 테스트
- [ ] tenant-service DB 연결 변경 및 테스트
- [ ] Prisma 마이그레이션 성공
- [ ] 3개 서비스 정상 실행 확인
- [ ] API 테스트 성공

## 🔧 실행 명령어

```bash
# 서비스 시작
pnpm nx serve auth-service
pnpm nx serve system-service
pnpm nx serve tenant-service

# Swagger 확인
open http://localhost:3001/api/docs
open http://localhost:3002/api/docs
open http://localhost:3006/api/docs
```

## 📚 참고 문서

- [Development Guide](file:///data/all-erp/docs/human/development_guide.md)

## 🚨 주의사항

- DATABASE_URL이 올바른 포트를 가리키는지 확인
- Prisma Client 재생성 필수
- 기존 환경 변수 백업
