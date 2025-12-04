# Task: Budget Service Refactoring

## 목표
`budget-service`에 공통 모듈을 적용하고 표준화된 부트스트랩을 사용하도록 리팩토링합니다.

## 작업 목록
- [ ] `apps/finance/budget-service/src/main.ts` 수정
    - [ ] `bootstrapService` 사용으로 교체
- [ ] `apps/finance/budget-service/src/app/app.module.ts` 수정
    - [ ] `SharedInfraModule` import
    - [ ] `SharedDomainModule` import
- [ ] 빌드 및 테스트
    - [ ] `nx build budget-service`
    - [ ] `nx test budget-service`
    - [ ] `nx e2e budget-service-e2e`

## 완료 조건
- `budget-service`가 정상적으로 빌드되고 실행되어야 함.
