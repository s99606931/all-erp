# MSA 기반 ERP 시스템 구축 전체 로드맵

## Phase 1: 프로젝트 초기화 및 서비스 스캐폴딩 (Scaffolding)
**목표**: 전체 마이크로서비스의 뼈대(Skeleton)를 만들고, 모노레포 구조를 확립하여 분산 개발 준비를 마칩니다.

- [ ] **프로젝트 초기화** <!-- id: 100 -->
    - [x] 기술 스택 선정 및 아키텍처 청사진 작성 (implementation_plan.md) <!-- id: 2 -->
    - [x] 개발 지침 문서화 및 구조화 (docs/human, docs/ai) <!-- id: 22 -->
    - [ ] Nx Monorepo 워크스페이스 생성 (NestJS + Next.js) <!-- id: 101 -->
    - [ ] 환경 변수 관리 전략 수립 (.env.example, .env.local) <!-- id: 106 -->
    - [ ] **SaaS 멀티테넌시 전략 수립**: DB 격리 수준(Schema/Row), 테넌트 식별(Subdomain/Header) 정의 <!-- id: 108 -->
- [ ] **표준화 및 품질 보증 산출물 작성 (Standardization)** <!-- id: 107 -->
    - [ ] **API 설계 지침**: RESTful API 표준, 응답 포맷, 에러 코드 정의 <!-- id: 107-1 -->
    - [ ] **DB 설계 지침**: 네이밍 규칙, 인덱싱 전략, 마이그레이션 절차 <!-- id: 107-2 -->
    - [ ] **테스트 전략 문서**: Unit/Integration/E2E 테스트 범위 및 도구 정의 <!-- id: 107-3 -->
    - [ ] **아키텍처 결정 기록 (ADR) 템플릿**: 주요 의사결정 기록 양식 생성 <!-- id: 107-4 -->
    - [ ] **데이터 일관성 및 트랜잭션 전략**: Saga Pattern, 분산 락 등 전략 수립 <!-- id: 107-5 -->
- [ ] **서비스 스캐폴딩 (Empty Services 생성)** <!-- id: 105 -->
    *각 서비스는 기본 모듈, 헬스 체크 API, Swagger 설정을 포함해야 합니다.*
    - [ ] **System Domain**
        - [ ] `auth-service` (인증/인가, Port: 3001) <!-- id: 105-1 -->
        - [ ] `system-service` (시스템/공통, Port: 3002) <!-- id: 105-2 -->
        - [ ] `tenant-service` (테넌트/구독 관리, Port: 3006) <!-- id: 105-13 -->
    - [ ] **HR Domain**
        - [ ] `personnel-service` (인사관리, Port: 3011) <!-- id: 105-3 -->
        - [ ] `payroll-service` (급여관리, Port: 3012) <!-- id: 105-4 -->
        - [ ] `attendance-service` (복무관리, Port: 3013) <!-- id: 105-5 -->
    - [ ] **Finance Domain**
        - [ ] `budget-service` (예산회계, Port: 3021) <!-- id: 105-6 -->
        - [ ] `accounting-service` (재무회계, Port: 3022) <!-- id: 105-7 -->
        - [ ] `settlement-service` (회계결산, Port: 3023) <!-- id: 105-8 -->
    - [ ] **General Domain**
        - [ ] `asset-service` (자산관리, Port: 3031) <!-- id: 105-9 -->
        - [ ] `supply-service` (물품관리, Port: 3032) <!-- id: 105-10 -->
        - [ ] `general-affairs-service` (총무관리, Port: 3033) <!-- id: 105-11 -->
    - [ ] **AI Domain**
        - [ ] `ai-service` (LLM/ML 연동, Port: 3007) <!-- id: 105-14 -->
    - [ ] **Frontend**: `web-admin` (Shell, Port: 4200) <!-- id: 105-12 -->

## Phase 2: DevOps 및 개발 환경 구축 (Prioritized)
**목표**: 개별 서비스 개발 전에 CI/CD 및 배포 환경을 먼저 구축하여, 개발자가 로직 구현에만 집중할 수 있는 환경을 제공합니다.

- [ ] **컨테이너 및 오케스트레이션** <!-- id: 510 -->
    - [ ] 모든 서비스에 대한 Dockerfile 작성 (Multi-stage build) <!-- id: 511 -->
    - [ ] Docker Compose 기반 로컬 개발 환경 구성 (PostgreSQL, Redis, RabbitMQ) <!-- id: 102 -->
    - [ ] Kubernetes 매니페스트 (Helm Charts) 기본 구성 <!-- id: 512 -->
- [ ] **CI/CD 파이프라인** <!-- id: 500 -->
    - [ ] GitHub Actions: PR 검증 (Lint, Test, Build) <!-- id: 501 -->
    - [ ] GitHub Actions: 이미지 빌드 및 레지스트리 푸시 <!-- id: 503 -->
- [ ] **게이트웨이 및 네트워크** <!-- id: 520 -->
    - [ ] API Gateway (Kong/Nginx) 라우팅 설정 (Empty 서비스 연결) <!-- id: 521 -->

## Phase 3: 공통 기반 및 시스템 서비스 구현
**목표**: 모든 서비스가 공통으로 사용하는 인증, 인가, 공통 코드 등을 구현합니다.

- [ ] **공통 모듈 개발 (Shared Libs)** <!-- id: 103 -->
    - [ ] `shared-util`: 공통 유틸리티 함수 <!-- id: 103-1 -->
    - [ ] `shared-domain`: 공통 DTO, Error Handling, Response Wrapper <!-- id: 103-2 -->
    - [ ] `shared-infra`: Database Module (Prisma), Message Queue Module <!-- id: 103-3 -->
    - [ ] **Multi-tenancy Core**: Tenant Context Middleware, DB Isolation Strategy 구현 <!-- id: 103-4 -->
- [ ] **인증/인가 서비스 (Auth)** <!-- id: 110 -->
    - [ ] User Entity 및 Repository 구현 <!-- id: 110-1 -->
    - [ ] JWT 발급 및 검증 (Tenant ID 포함), Refresh Token 전략 구현 <!-- id: 110-2 -->
    - [ ] RBAC (Role-Based Access Control) Guard 구현 <!-- id: 110-3 -->
- [ ] **시스템 및 테넌트 관리** <!-- id: 120 -->
    - [ ] `tenant-service`: 테넌트 생성(Onboarding), 설정 관리, 구독 관리 <!-- id: 125 -->
    - [ ] `system-service`: 공통 코드, 사용자/조직 관리 (Tenant 격리 적용) <!-- id: 121 -->

## Phase 4: 핵심 도메인 서비스 병렬 개발 (Distributed Dev)
**목표**: 구축된 환경 위에서 각 도메인별 서비스를 병렬로 개발합니다. 각 서비스는 **설계 -> 구현 -> 테스트** 순으로 진행합니다.

- [ ] **HR Domain (인사/급여/복무)** <!-- id: 200 -->
    - [ ] DB 스키마 설계 (Prisma Schema) <!-- id: 200-1 -->
    - [ ] `personnel-service`: 인사카드, 발령, 제증명 구현 <!-- id: 201 -->
    - [ ] `payroll-service`: 급여 계산, 대장, 연말정산 구현 <!-- id: 202 -->
    - [ ] `attendance-service`: 근태, 휴가, 출장 구현 <!-- id: 203 -->
- [ ] **Finance Domain (예산/재무/결산)** <!-- id: 300 -->
    - [ ] DB 스키마 설계 (Prisma Schema) <!-- id: 300-1 -->
    - [ ] `budget-service`: 예산 편성, 배정, 전용 구현 <!-- id: 301 -->
    - [ ] `accounting-service`: 지출 품의/결의, 자금 배정 구현 <!-- id: 302 -->
    - [ ] `settlement-service`: 결산서, 재무제표 구현 <!-- id: 303 -->
- [ ] **General Domain (총무/자산/물품)** <!-- id: 600 -->
    - [ ] DB 스키마 설계 (Prisma Schema) <!-- id: 600-1 -->
    - [ ] `asset-service`: 자산 등록, 변동, 감가상각 구현 <!-- id: 601 -->
    - [ ] `supply-service`: 물품 수급, 재고 관리 구현 <!-- id: 602 -->
    - [ ] `general-affairs-service`: 차량, 행사, 문서 관리 구현 <!-- id: 603 -->
- [ ] **중간 점검 및 피드백 (Iterative Review)** <!-- id: 450 -->
    - [ ] 핵심 기능(MVP) Staging 배포 및 사용자 데모 <!-- id: 451 -->
    - [ ] 사용자 피드백 수집 및 개선 사항 도출 <!-- id: 452 -->

## Phase 5: 프론트엔드 통합 및 고도화
**목표**: 각 마이크로서비스의 API를 연동하고 사용자 인터페이스를 완성합니다.

- [ ] **UI/UX 디자인 시스템** <!-- id: 400 -->
    - [ ] 공통 컴포넌트 (Shadcn/UI) 및 레이아웃 (Sidebar, Header) <!-- id: 401 -->
    - [ ] API Client 생성 (React Query / Axios) <!-- id: 402 -->
- [ ] **통합 웹 (Web Admin)** <!-- id: 410 -->
    - [ ] 인증(Login) 및 라우팅 가드 구현 <!-- id: 411 -->
    - [ ] 서비스별 화면 구현 및 연동 (Micro-frontend 패턴 고려) <!-- id: 412 -->
    - [ ] 대시보드 및 통합 기능 <!-- id: 413 -->

## Phase 6: 안정화 및 운영 이관
- [ ] **모니터링 및 로깅** <!-- id: 513 -->
    - [ ] ELK Stack (Logs), Prometheus/Grafana (Metrics)
    - [ ] Tracing (Jaeger/Zipkin)
- [ ] **비기능 요건 검증 (Non-functional Testing)** <!-- id: 600 -->
    - [ ] **보안 감사 (Security Audit)**: 취약점 점검 및 모의 해킹 <!-- id: 601 -->
    - [ ] **부하 테스트 (Load Testing)**: k6/JMeter 활용 임계치 테스트 <!-- id: 602 -->
    - [ ] **장애 복구 훈련 (Chaos Engineering)**: 서비스 다운 시나리오 검증 <!-- id: 603 -->
- [ ] **최종 테스트 및 배포** <!-- id: 700 -->
    - [ ] 통합 테스트 (E2E) 시나리오 수행 <!-- id: 701 -->
    - [ ] 운영 환경 배포 및 이관 <!-- id: 702 -->
