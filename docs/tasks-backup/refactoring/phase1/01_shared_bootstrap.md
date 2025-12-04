# Task: Shared Bootstrap Implementation

## 목표
모든 마이크로서비스에서 공통으로 사용할 `bootstrapService` 함수를 구현하여 초기화 로직(Port, Swagger, ValidationPipe, Logger)을 표준화합니다.

## 작업 목록
- [ ] `libs/shared/infra/src/lib/bootstrap` 디렉토리 생성
- [ ] `libs/shared/infra/src/lib/bootstrap/bootstrap.ts` 파일 작성
    - [ ] `NestFactory.create` 호출
    - [ ] `WinstonModule` 로거 설정
    - [ ] `ValidationPipe` 전역 설정 (whitelist, transform)
    - [ ] `GlobalExceptionFilter` 전역 설정
    - [ ] `Swagger` 설정 (Title, Version 등 옵션화)
    - [ ] `app.listen` 호출
- [ ] `libs/shared/infra/src/index.ts`에서 `bootstrap` 함수 export
- [ ] `libs/shared/infra` 빌드 및 테스트 (`nx build shared-infra`, `nx test shared-infra`)

## 완료 조건
- `bootstrapService` 함수가 정상적으로 빌드되고 export 되어야 함.
