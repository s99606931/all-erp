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
        - [ ] `ai-service` (LLM/ML 연동, Port: 8000) <!-- id: 105-14 -->
    - [ ] **Frontend**: `web-admin` (Shell, Port: 4200) <!-- id: 105-12 -->
- [ ] **비기능 요건 검증 (Non-functional Testing)** <!-- id: 600 -->
    - [ ] **보안 감사 (Security Audit)**: 취약점 점검 및 모의 해킹 <!-- id: 601 -->
    - [ ] **부하 테스트 (Load Testing)**: k6/JMeter 활용 임계치 테스트 <!-- id: 602 -->
    - [ ] **장애 복구 훈련 (Chaos Engineering)**: 서비스 다운 시나리오 검증 <!-- id: 603 -->
    - [ ] Dockerfile (Multi-stage) 및 Docker Compose 구성 <!-- id: 511 -->
    - [ ] Vector DB (Milvus) 구축 <!-- id: 513 -->
    - [ ] LLM Serving (vLLM) 구축 (GPU) <!-- id: 514 -->
    - [ ] Kubernetes 매니페스트 (Helm) 구성 <!-- id: 512 -->
- [ ] **최종 테스트 및 배포** <!-- id: 700 -->
    - [ ] 통합 테스트 (E2E) 시나리오 수행 <!-- id: 701 -->
    - [ ] 운영 환경 배포 및 이관 <!-- id: 702 -->
