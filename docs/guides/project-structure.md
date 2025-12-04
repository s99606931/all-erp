# 프로젝트 구조 및 네이밍 컨벤션 가이드

## 1. 폴더 구조 (Folder Structure)

### 1.1 Apps (`apps/`)
각 마이크로서비스는 다음과 같은 표준 구조를 따릅니다.

```
apps/<domain>/<service-name>/src/
├── app/
│   ├── api/          # Controller (외부 요청 처리)
│   ├── domain/       # Service, Business Logic (핵심 로직)
│   ├── infra/        # Repository, External API (데이터 접근)
│   └── app.module.ts # Root Module
├── assets/           # 정적 파일
├── environments/     # 환경 변수 설정
└── main.ts           # Entry Point (Bootstrap)
```

### 1.2 Libs (`libs/`)
공통 라이브러리는 `libs/shared` 하위에 위치하며, 기능별로 구분합니다.

```
libs/shared/
├── util/     # 순수 유틸리티 함수 (의존성 없음)
├── domain/   # 공통 DTO, Exception, Interface
├── infra/    # Database, Logger, Message Queue 등 인프라
└── tenancy/  # Multi-tenancy 관련 로직
```

## 2. 네이밍 컨벤션 (Naming Conventions)

### 2.1 파일 및 폴더
- **Kebab Case** 사용 (`my-service.ts`, `user-profile/`)
- 클래스 파일: `*.ts`
- 모듈 파일: `*.module.ts`
- 서비스 파일: `*.service.ts`
- 컨트롤러 파일: `*.controller.ts`
- 테스트 파일: `*.spec.ts`

### 2.2 클래스 및 인터페이스
- **Pascal Case** 사용 (`UserService`, `UserProfile`)
- 인터페이스: `I` 접두어 사용 지양 (예: `User` O, `IUser` X)

### 2.3 변수 및 함수
- **Camel Case** 사용 (`getUser`, `isValid`)
- 상수: **UPPER_SNAKE_CASE** 사용 (`MAX_RETRY_COUNT`)

## 3. 모듈 경계 (Module Boundaries)
- **Apps**는 **Libs**를 참조할 수 있습니다.
- **Libs**는 다른 **Libs**를 참조할 수 있지만, 순환 참조는 금지됩니다.
- **Libs**는 **Apps**를 참조할 수 **없습니다**.
- **Shared Libs** 간 참조 순서:
    - `util` (최하위)
    - `domain` -> `util`
    - `infra` -> `domain`, `util`

## 4. 공통 모듈 사용
모든 서비스는 `libs/shared`의 공통 모듈을 사용하여 일관성을 유지해야 합니다.
- `bootstrapService`: `main.ts` 초기화 시 사용
- `SharedInfraModule`: `AppModule` import
- `SharedDomainModule`: `AppModule` import
