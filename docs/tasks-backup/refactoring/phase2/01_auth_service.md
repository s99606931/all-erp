# Task: Auth Service Refactoring

## 목표
`auth-service`에 공통 모듈을 적용하고 표준화된 부트스트랩을 사용하도록 리팩토링합니다.

## 작업 목록
- [ ] `apps/system/auth-service/src/main.ts` 수정
    - [ ] `bootstrapService` (from `@all-erp/shared/infra`) 사용으로 교체
- [ ] `apps/system/auth-service/src/app/app.module.ts` 수정
    - [ ] `SharedInfraModule` (Prisma, Logger 등) import
    - [ ] `SharedDomainModule` (ExceptionFilter 등) import
- [ ] `apps/system/auth-service/project.json` 확인
    - [ ] Lint, Test 타겟 확인
- [ ] 빌드 및 테스트
    - [ ] `nx build auth-service`
    - [ ] `nx test auth-service`
    - [ ] `nx e2e auth-service-e2e`

## 완료 조건
- `auth-service`가 정상적으로 빌드되고 실행되어야 함.
- 공통 로거 및 예외 필터가 적용되어야 함.
