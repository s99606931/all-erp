# 개발 가이드 (Development Guide)

> 실제 개발 시 필요한 **로컬 실행, 테스트, 디버깅, 트러블슈팅** 방법을 정리한 문서입니다.

## 1. 로컬 개발 환경

### 1.1 환경 변수 설정

#### 필수 환경 변수 (`.env`)
```bash
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/erp_dev"

# Redis
REDIS_URL="redis://localhost:6379"

# RabbitMQ
RABBITMQ_URL="amqp://guest:guest@localhost:5672"

# JWT
JWT_SECRET="your-super-secret-key-change-in-production"
JWT_EXPIRES_IN="1h"
REFRESH_TOKEN_EXPIRES_IN="7d"

# AI (OpenAI)
OPENAI_API_KEY="sk-..."

# Application
NODE_ENV="development"
PORT=3000
```

### 1.2 서비스별 포트 번호

| 서비스 | 포트 | 설명 |
|---------|------|------|
| `auth-service` | 3001 | 인증/인가 |
| `system-service` | 3002 | 시스템 관리 |
| `tenant-service` | 3006 | 테넌트 관리 |
| `personnel-service` | 3011 | 인사 관리 |
| `payroll-service` | 3012 | 급여 관리 |
| `attendance-service` | 3013 | 복무 관리 |
| `budget-service` | 3021 | 예산 회계 |
| `accounting-service` | 3022 | 재무 회계 |
| `settlement-service` | 3023 | 회계 결산 |
| `asset-service` | 3031 | 자산 관리 |
| `supply-service` | 3032 | 물품 관리 |
| `general-affairs-service` | 3033 | 총무 관리 |
| `ai-service` | 3007 | AI 서비스 |
| `web-admin` | 4200 | 관리자 웹 |

---

## 2. 개발 명령어

### 2.1 Nx 명령어 기본

```bash
# 특정 서비스 실행
pnpm nx serve <service-name>

# 특정 서비스 빌드
pnpm nx build <service-name>

# 특정 서비스 테스트
pnpm nx test <service-name>

# 특정 서비스 린트
pnpm nx lint <service-name>

# 의존성 그래프 확인
pnpm nx graph
```

### 2.2 자주 사용하는 명령어

```bash
# 여러 서비스 동시 실행
pnpm nx run-many --target=serve --projects=auth-service,system-service

# 변경된 프로젝트만 테스트 (Nx Affected)
pnpm nx affected:test

# 전체 빌드
pnpm nx run-many --target=build --all

# 코드 포맷팅
pnpm nx format:write

# 린트 자동 수정
pnpm nx run-many --target=lint --all --fix
```

---

## 3. 데이터베이스 작업

### 3.1 Prisma 기본 명령어

```bash
# Prisma Client 생성 (타입 생성)
pnpm prisma generate

# 마이그레이션 파일 생성 및 적용
pnpm prisma migrate dev --name <migration-name>

# 운영 환경 마이그레이션 적용
pnpm prisma migrate deploy

# Prisma Studio 실행 (DB GUI)
pnpm prisma studio

# DB 초기화 (개발 환경에서만!)
pnpm prisma migrate reset
```

### 3.2 멀티테넌시 스키마 관리

각 테넌트는 별도의 PostgreSQL 스키마를 사용합니다.

```sql
-- 새 테넌트 스키마 생성
CREATE SCHEMA tenant_a;

-- 스키마 전환
SET search_path TO tenant_a;

-- Prisma는 런타임에 자동으로 스키마 전환
```

---

## 4. 테스트

### 4.1 단위 테스트 (Unit Test)

```bash
# 특정 서비스 테스트
pnpm nx test auth-service

# Watch 모드
pnpm nx test auth-service --watch

# 커버리지 확인
pnpm nx test auth-service --coverage
```

**테스트 파일 작성 예시**:
```typescript
// user.service.spec.ts
describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should create a user', async () => {
    // Given
    const createUserDto = { email: 'test@example.com' };

    // When
    const user = await service.create(createUserDto);

    // Then
    expect(user).toBeDefined();
    expect(user.email).toBe('test@example.com');
  });
});
```

### 4.2 E2E 테스트

```bash
# E2E 테스트 실행
pnpm nx e2e web-admin-e2e

# Watch 모드
pnpm nx e2e web-admin-e2e --watch
```

---

## 5. 디버깅

### 5.1 VSCode 디버깅 설정

`.vscode/launch.json` 파일 생성:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Auth Service",
      "runtimeExecutable": "pnpm",
      "runtimeArgs": ["nx", "serve", "auth-service"],
      "console": "integratedTerminal",
      "restart": true,
      "protocol": "inspector"
    }
  ]
}
```

### 5.2 로그 확인

```typescript
// winston logger 사용
import { Logger } from '@nestjs/common';

const logger = new Logger('UserService');
logger.log('사용자 생성 시작');
logger.error('에러 발생', error.stack);
logger.debug('디버그 정보', { userId: 1 });
```

---

## 6. 트러블슈팅

### 문제 1: 포트 이미 사용 중
```bash
# 윈도우
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3001 | xargs kill -9
```

### 문제 2: Prisma Client가 업데이트되지 않음
```bash
pnpm prisma generate
# 서비스 재시작
```

### 문제 3: Docker 컨테이너 문제
```bash
# 전체 재시작
docker-compose -f docker-compose.infra.yml down
docker-compose -f docker-compose.infra.yml up -d

# 로그 확인
docker-compose -f docker-compose.infra.yml logs -f postgres
```

### 문제 4: pnpm install 실패
```bash
# 캐시 삭제 후 재설치
pnpm store prune
rm -rf node_modules
pnpm install
```

---

## 7. 성능 최적화

### 7.1 DB 쿼리 최적화
```typescript
// N+1 문제 해결: include 사용
const users = await prisma.user.findMany({
  include: {
    profile: true,  // 한 번에 조인
  },
});

// 필요한 필드만 선택
const users = await prisma.user.findMany({
  select: {
    id: true,
    email: true,
  },
});
```

### 7.2 캐싱 전략
```typescript
// Redis 캐싱 예시
const cachedData = await redis.get(`user:${id}`);
if (cachedData) {
  return JSON.parse(cachedData);
}

const user = await prisma.user.findUnique({ where: { id } });
await redis.set(`user:${id}`, JSON.stringify(user), 'EX', 3600);
return user;
```

---

## 8. 배포 전 체크리스트

- [ ] 모든 테스트 통과 (`pnpm nx affected:test`)
- [ ] 린트 에러 없음 (`pnpm nx affected:lint`)
- [ ] 환경 변수 확인 (운영 환경)
- [ ] 마이그레이션 파일 생성 및 검토
- [ ] Swagger 문서 업데이트
- [ ] 성능 테스트 실행 (필요시)

---

## 9. 참조 문서

- **온보딩**: [`README.md`](./README.md)
- **코딩 컨벤션**: [`coding_convention.md`](./coding_convention.md)
- **협업 가이드**: [`collaboration_guide.md`](./collaboration_guide.md)
- **전체 로드맵**: [`../project_roadmap.md`](../project_roadmap.md)
