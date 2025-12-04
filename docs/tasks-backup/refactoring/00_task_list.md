# 리팩토링 태스크 파일 목록 (Refactoring Task File List)

요청하신 대로 AI가 실행 가능한 최소 단위(서비스 단위)로 분할된 태스크 파일 목록입니다.
각 파일은 `docs/tasks/refactoring/` 하위에 단계별 폴더로 생성될 예정입니다.

## 📂 Phase 1: 공통 기반 (Common Foundation)
공통적으로 사용될 부트스트랩 함수와 린트 규칙을 먼저 적용합니다.
- `docs/tasks/refactoring/phase1/01_shared_bootstrap.md`: 공통 Bootstrap 함수 구현 (Port, Swagger, ValidationPipe 등 표준화)
- `docs/tasks/refactoring/phase1/02_lint_structure.md`: 모듈 경계(Module Boundaries) 규칙 강화 및 폴더 구조 표준화

## 📂 Phase 2: Core 서비스 (System & Auth)
다른 서비스의 기반이 되는 핵심 서비스를 우선 리팩토링합니다.
- `docs/tasks/refactoring/phase2/01_auth_service.md`: Auth Service 리팩토링
- `docs/tasks/refactoring/phase2/02_system_service.md`: System Service 리팩토링
- `docs/tasks/refactoring/phase2/03_tenant_service.md`: Tenant Service 리팩토링

## 📂 Phase 3: Finance 도메인
- `docs/tasks/refactoring/phase3/01_accounting_service.md`: Accounting Service 리팩토링
- `docs/tasks/refactoring/phase3/02_budget_service.md`: Budget Service 리팩토링
- `docs/tasks/refactoring/phase3/03_settlement_service.md`: Settlement Service 리팩토링

## 📂 Phase 4: HR 도메인
- `docs/tasks/refactoring/phase4/01_personnel_service.md`: Personnel Service 리팩토링
- `docs/tasks/refactoring/phase4/02_attendance_service.md`: Attendance Service 리팩토링
- `docs/tasks/refactoring/phase4/03_payroll_service.md`: Payroll Service 리팩토링

## 📂 Phase 5: General 도메인
- `docs/tasks/refactoring/phase5/01_asset_service.md`: Asset Service 리팩토링
- `docs/tasks/refactoring/phase5/02_supply_service.md`: Supply Service 리팩토링
- `docs/tasks/refactoring/phase5/03_general_affairs_service.md`: General Affairs Service 리팩토링

## 📂 Phase 6: AI 도메인
- `docs/tasks/refactoring/phase6/01_ai_service.md`: AI Service 리팩토링

---
**총 15개 태스크 파일**이 생성됩니다.
각 태스크 파일은 다음 절차를 포함합니다:
1. `main.ts` 수정 (공통 Bootstrap 적용)
2. `AppModule` 수정 (Shared Infra/Domain 모듈 Import)
3. `project.json` 확인 (Lint/Test 설정)
4. 빌드 및 테스트 검증
