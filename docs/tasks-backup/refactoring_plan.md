# 프로젝트 리팩토링 및 고도화 계획 (Project Refactoring & Enhancement Plan)

## 1. 개요 (Overview)
본 문서는 `all-erp` 프로젝트의 서비스 간 코드 일관성을 유지하고, 향후 기능 확장을 용이하게 하기 위한 체계적인 리팩토링 계획을 기술합니다. 현재 구축된 공통 라이브러리(Shared Libs)를 전사적으로 적용하고, 아키텍처 표준을 정립하는 것을 목표로 합니다.

## 2. 현황 분석 (Current Status Analysis)
*   **구조**: Nx Monorepo 기반으로 Domain별(Finance, HR, System 등) 앱이 분리되어 있음.
*   **공통 모듈**: `libs/shared` 하위에 Util, Domain, Infra, Tenancy 등이 구현되어 있으나, 개별 서비스(`apps/*`)에서의 적용률이 낮음.
*   **일관성**: 서비스별 `main.ts` 설정(ValidationPipe, Swagger, Logging 등)이 파편화될 가능성이 있음.
*   **테스트**: 각 서비스별 E2E 테스트 프로젝트가 존재하지만, 통합된 테스트 전략이 필요함.

## 3. 리팩토링 목표 (Refactoring Goals)
1.  **코드 일관성 확보**: 모든 마이크로서비스가 동일한 패턴과 설정을 공유.
2.  **공통 모듈 전면 도입**: 중복 코드를 제거하고 검증된 Shared Libs 사용.
3.  **유지보수성 향상**: 중앙 집중식 설정 관리로 변경 사항 전파 용이.
4.  **확장성 대비**: 향후 서비스 추가 시 Scaffolding 속도 향상.

## 4. 상세 실행 계획 (Detailed Execution Plan)

### 4.1 공통 모듈 적용 (Shared Libs Adoption)
기존에 구현된 `3.1_shared_libs`의 결과물을 모든 서비스에 적용합니다.

*   **Infra Module 적용**:
    *   `Winston Logger` 교체: `NestJS` 기본 로거 대신 구조화된 로깅 적용.
    *   `Prisma Module` 적용: DB 연결 및 Multi-tenancy 미들웨어 적용.
    *   `Global Exception Filter` 적용: 표준화된 에러 응답 포맷 사용.
*   **Domain Module 적용**:
    *   DTO 상속: 공통 `ApiResponse`, `PaginatedResponse` 활용.
    *   Business Exception 사용: `EntityNotFoundException` 등 표준 예외 사용.

### 4.2 부트스트랩 표준화 (Bootstrap Standardization)
각 서비스의 `main.ts`를 표준화하여 설정 누락을 방지합니다.

*   **Bootstrap Factory 도입**: `libs/shared/infra` 또는 `config`에 공통 부트스트랩 함수 생성.
    *   포트 설정, Global Prefix, Swagger, ValidationPipe, ExceptionFilter 등을 일괄 설정.
*   **환경 변수 관리**: `ConfigModule`을 통해 환경 변수 로딩 및 검증 로직 통일.

### 4.3 프로젝트 구조 및 린트 강화 (Structure & Linting)
*   **폴더 구조 통일**:
    *   `src/app/api`: Controller
    *   `src/app/domain`: Service, Business Logic
    *   `src/app/infra`: Repository, External Adapters
*   **Module Boundaries**: `nx enforce-module-boundaries` 규칙을 강화하여 도메인 간 무분별한 참조 방지.
*   **Strict Mode**: `tsconfig`의 `strict` 모드 준수 여부 점검.

### 4.4 테스트 및 문서화 (Testing & Documentation)
*   **E2E 테스트 표준화**: 공통 모듈이 적용된 상태에서의 E2E 테스트 시나리오 점검.
*   **API 문서화**: Swagger 데코레이터 표준 가이드 배포.

## 5. 단계별 진행 (Phased Approach)

| 단계 | 작업명 | 설명 | 예상 기간 |
| :-- | :--- | :--- | :-- |
| **Phase 1** | **표준화 준비** | 공통 Bootstrap 함수 구현, Lint 규칙 정비 | 1주 |
| **Phase 2** | **Core 서비스 적용** | System, Auth 등 핵심 서비스에 우선 적용 및 검증 | 1주 |
| **Phase 3** | **전사 확산** | Finance, HR, General 등 모든 도메인 서비스로 확대 | 2주 |
| **Phase 4** | **안정화** | 통합 테스트 수행 및 성능 튜닝 | 1주 |

## 6. 기대 효과 (Expected Outcomes)
*   새로운 서비스 생성 시 설정 시간 50% 단축.
*   버그 수정 시 공통 모듈 배포로 전사 일괄 적용 가능.
*   로그 및 에러 포맷 통일로 모니터링 효율성 증대.
