# 아키텍처 표준 및 가이드 (Architecture Standards & Guide)

## 1. 개요
본 문서는 `all-erp` 프로젝트의 아키텍처 표준과 개발 가이드를 요약합니다.
상세한 내용은 [`docs/guides/project-structure.md`](file:///data/all-erp/docs/guides/project-structure.md)를 참고하십시오.

## 2. 핵심 원칙
1.  **공통 모듈 우선 사용**: 중복 코드를 작성하지 말고 `libs/shared`의 기능을 활용합니다.
2.  **계층형 아키텍처**: `api` -> `domain` -> `infra`의 의존성 방향을 지킵니다.
3.  **표준화된 초기화**: 모든 서비스는 동일한 방식으로 부트스트랩되어야 합니다.
4.  **Database per Service**: 각 서비스는 독립된 DB 인스턴스를 가지며, 다른 서비스 DB에 직접 접근을 금지합니다.
5.  **이벤트 기반 통신**: 서비스 간 데이터 동기화는 RabbitMQ 이벤트를 활용합니다.

## 3. 필수 적용 사항

### 3.1 Bootstrap
모든 마이크로서비스의 `main.ts`는 다음과 같이 작성되어야 합니다.

```typescript
import { bootstrapService } from '@all-erp/shared/infra';
import { AppModule } from './app/app.module';

async function bootstrap() {
  await bootstrapService({
    module: AppModule,
    serviceName: 'my-service',
    port: 3000,
    swagger: {
      title: 'My Service API',
      description: 'API Description',
      version: '1.0',
    },
  });
}

bootstrap();
```

### 3.2 Modules
`AppModule`에는 다음 모듈이 포함되어야 합니다.

```typescript
@Module({
  imports: [
    SharedInfraModule, // Prisma, Logger, RabbitMQ
    SharedDomainModule, // Exception Filter
    // ...
  ],
})
export class AppModule {}
```

### 3.3 Database per Service 원칙

각 서비스는 독립된 DB 인스턴스를 사용합니다.

```typescript
// ❌ 금지: 다른 서비스 DB 직접 접근
const employee = await otherServicePrisma.employee.findUnique(...);

// ✅ 권장: HTTP API 호출
const employee = await this.httpService.get(
  'http://personnel-service:3011/api/v1/employees/123'
).toPromise();

// ✅ 권장: 이벤트 구독
@EventPattern('employee.updated')
async handleEmployeeUpdated(data: EmployeeUpdatedEvent) {
  // 로컬 DB에 데이터 복제
  await this.prisma.employeeCache.upsert(...);
}
```

### 3.4 Micro Frontend 원칙

프론트엔드는 Module Federation을 사용하여 분리합니다.

**Shell 앱** (`apps/frontend/shell`):
- Remote 앱 로드 및 라우팅
- 공통 레이아웃 및 네비게이션
- 인증 및 전역 상태 관리

**Remote 앱** (`apps/frontend/remote/*`):
- 독립적인 도메인별 UI
- Shell 앱에 동적으로 로드됨

## 4. 참고 문서
- [프로젝트 구조 가이드](file:///data/all-erp/docs/guides/project-structure.md)
- [코딩 컨벤션](file:///data/all-erp/docs/human/coding_convention.md)
- [Database per Service 가이드](file:///data/all-erp/docs/architecture/database-per-service-guide.md)
- [Micro Frontend 가이드](file:///data/all-erp/docs/architecture/micro-frontend-guide.md)

