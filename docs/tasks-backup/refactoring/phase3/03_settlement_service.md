# Task: Settlement Service Refactoring

## 목표

`settlement-service`에 공통 모듈을 적용하고 표준화된 부트스트랩을 사용하도록 리팩토링합니다.

## 작업 목록

- [x] `apps/finance/settlement-service/src/main.ts` 수정
  - [x] `bootstrapService` 사용으로 교체
- [x] `apps/finance/settlement-service/src/app/app.module.ts` 수정
  - [x] `SharedInfraModule` import
  - [x] `SharedDomainModule` import
- [x] 빌드 및 테스트
  - [x] `nx build settlement-service`
  - [x] `nx test settlement-service`
  - [x] `nx e2e settlement-service-e2e`

## 완료 조건

- `settlement-service`가 정상적으로 빌드되고 실행되어야 함.
