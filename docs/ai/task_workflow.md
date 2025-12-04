# 작업 워크플로우 (Task Workflow)

> PRD 문서를 기반으로 작업을 진행하는 **표준 프로세스**를 정의합니다.

## 1. PRD 기반 작업 흐름

### Step 1: PRD 문서 읽기 📖
사용자가 지정한 PRD 파일(`docs/tasks/phaseN-xxx/X.Y_task_name.md`)을 열어 다음을 파악합니다:

#### 필수 확인 사항
- [ ] **Task ID**: 작업 고유 식별자
- [ ] **목표**: 이 작업이 왜 필요한가?
- [ ] **상세 요구사항**: 어떤 기능을 만들어야 하는가?
- [ ] **기술적 의사결정**: 권장사항(✅)이 무엇인가?
- [ ] **작업 단위**: 구체적인 명령어 및 파일 목록
- [ ] **승인 기준**: 완료 조건은 무엇인가?

### Step 2: 작업 계획 수립 📝
PRD를 읽은 후, 작업을 다음과 같이 계획합니다:

1. **파일 생성 목록 작성**: 어떤 파일을 만들거나 수정해야 하는가?
2. **명령어 실행 순서**: PRD의 "작업 단위" 섹션 참조
3. **의존성 확인**: 다른 서비스나 라이브러리에 의존하는가?

### Step 3: 코드 작성 💻

#### 3.1 명령어 실행
PRD에 명시된 명령어를 **정확히** 실행합니다.

**예시** (Phase 1: auth-service 생성):
```bash
pnpm nx g @nx/nest:app auth-service --directory=apps/system/auth-service
```

#### 3.2 코드 작성 시 준수 사항
- ✅ **`vibe_coding.md`의 페르소나 유지**: 시니어 개발자답게 간결하고 명확하게
- ✅ **한국어 주석 필수 작성**:
    - 모든 클래스, 인터페이스, 함수, 메서드에 한국어 주석 작성
    - JSDoc 스타일 사용 권장 (`/** */`)
    - 복잡한 비즈니스 로직에는 라인별 설명 추가
    - "왜(Why)" 이렇게 구현했는지 설명
- ✅ **타입 안전성**: `any` 최소화, 명시적 타입 정의
- ✅ **에러 처리**: 모든 API는 에러 핸들링 포함
- ✅ **유효성 검사**: DTO에는 `class-validator` 데코레이터 필수

### Step 4: 테스트 🧪
PRD의 "승인 기준"을 만족하는지 테스트합니다.

```bash
# 단위 테스트 실행
pnpm nx test auth-service

# 서비스 실행 확인
pnpm nx serve auth-service
```

### Step 5: 문서화 📄
작업 완료 후 다음을 업데이트합니다:

1. **Swagger**: API 엔드포인트에 `@ApiOperation`, `@ApiResponse` 데코레이터 추가
2. **README**: 해당 서비스의 `README.md`에 실행 방법, 환경 변수 설명 추가
3. **Task 체크**: `task.md` 아티팩트에서 완료한 항목 체크 (`[x]`)

### Step 6: 결과 보고서 작성 📝
모든 작업이 완료되면, 작업 결과를 정리하여 보고서를 작성합니다.

#### 6.1 파일명 규칙
- `docs/tasks/phaseN-xxx/[Task ID]_result.md`
- 예: `docs/tasks/phase1-init/1.6_scaffolding_finance_result.md`

#### 6.2 필수 포함 항목
보고서는 `1.6_scaffolding_finance_result.md` 수준의 품질을 유지해야 하며, 다음 항목을 반드시 포함합니다:

1.  **작업 개요 (Summary)**: 무엇을 했는지 요약
2.  **수행 내용 (Details)**: 주요 변경 사항 및 기능 설명
3.  **기술 스택 및 아키텍처 (Architecture)**:
    - **Mermaid 다이어그램 필수 포함**
    - 시스템 구조, 데이터 흐름 등을 시각화
4.  **검증 결과 (Verification)**:
    - 테스트 실행 결과 (스크린샷 또는 로그)
    - Swagger UI, Health Check 확인 결과
5.  **승인 기준 달성 여부**: PRD의 승인 기준 대비 달성 현황
6.  **Why This Matters**: 이 작업이 프로젝트에 왜 중요한지 설명

> **참고**: [`docs/tasks/phase1-init/1.6_scaffolding_finance_result.md`](../tasks/phase1-init/1.6_scaffolding_finance_result.md) 문서를 템플릿으로 활용하세요.

---

## 2. PRD 문서 구조 이해

### 2.1 표준 PRD 섹션
모든 PRD는 다음 섹션을 포함합니다:

| 섹션 | 설명 |
|------|------|
| **1. 개요** | Task ID, 목표, 관련 로드맵 |
| **2. 상세 요구사항** | 구현해야 할 기능 목록 |
| **3. 기술적 의사결정** | 선택지와 권장사항(✅) |
| **4. 작업 단위** | 실행할 명령어 및 순서 |
| **5. 승인 기준** | 완료 조건 (테스트 항목) |

### 2.2 기술적 의사결정 읽는 법
PRD의 "3. 기술적 의사결정"은 **여러 선택지**와 **권장사항(✅)**을 제시합니다.

**예시**:
```markdown
### 3.1 패키지 매니저 (Package Manager)
- **선택지 A**: `npm`
- **선택지 B**: `yarn`
- **선택지 C**: `pnpm`
- **✅ 권장사항**: **`pnpm`**
    - **이유**: 모노레포에 최적화, 빠른 설치 속도
```

**AI의 대응**:
1. **기본적으로 권장사항 따름**: `pnpm` 사용
2. **사용자가 다른 선택 요청 시**: 해당 선택으로 진행
3. **권장 이유 설명 가능**: 사용자 질문 시 "이유" 부분 참조하여 답변

---

## 3. 작업 시 자주 묻는 질문 (FAQ)

### Q1. PRD에 명령어가 없으면?
A: "작업 단위" 섹션을 참고하되, 구체적 명령어가 없다면 `project_context.md`와 `coding_convention.md`를 참조하여 표준 패턴을 따릅니다.

### Q2. Database per Service 패턴 주의사항
A: 각 서비스는 독립적인 데이터베이스를 사용해야 합니다. 서비스 간 직접적인 데이터베이스 접근은 금지되며, API를 통한 통신만 허용됩니다.

### Q3. 기술적 의사결정이 여러 개면?
A: **✅ 권장사항**을 우선 적용하되, 사용자에게 선택지를 제시하고 확인받습니다.

### Q4. PRD와 실제 코드베이스가 다르면?
A: **현재 코드베이스 우선**. PRD는 초기 계획이므로, 이미 구현된 코드가 있다면 그 패턴을 따릅니다.

### Q5. 테스트 작성은 필수인가?
A: PRD의 "승인 기준"에 테스트가 명시되어 있으면 **필수**. 명시 안 되어도 핵심 로직(급여 계산, 회계 분개 등)은 테스트 작성 권장.

---

## 4. 작업 완료 체크리스트

작업 완료 전 다음을 확인하세요:

### 코드 품질
- [ ] **모든 주석이 한국어로 작성되었는가?**
    - [ ] 모든 클래스/인터페이스에 한국어 주석 존재
    - [ ] 모든 public 함수/메서드에 한국어 주석 존재
    - [ ] 복잡한 로직에 설명 주석 존재
- [ ] `any` 타입 사용을 최소화했는가?
- [ ] 에러 처리가 적절히 되어 있는가?
- [ ] DTO에 유효성 검사 데코레이터가 있는가?

### PRD 충족
- [ ] "상세 요구사항"의 모든 항목을 구현했는가?
- [ ] "기술적 의사결정"의 권장사항을 따랐는가?
- [ ] "승인 기준"을 모두 만족하는가?

### 문서화
- [ ] Swagger 문서가 갱신되었는가?
- [ ] README가 업데이트되었는가?
- [ ] `task.md`에서 완료 항목을 체크했는가?
- [ ] **결과 보고서(`_result.md`)가 작성되었는가?**
    - [ ] Mermaid 아키텍처 다이어그램이 포함되었는가?
    - [ ] 검증 결과가 상세히 기록되었는가?

---

## 5. 예시: Phase 1.4 작업 진행

### PRD: `1.4_scaffolding_system.md`
**목표**: `auth-service`, `system-service`, `tenant-service` 생성

### 실제 작업 흐름:

#### 1. PRD 읽기
- 포트: 3001, 3002, 3006
- 기본 설정: Health Check, Swagger

#### 2. 명령어 실행
```bash
pnpm nx g @nx/nest:app auth-service --directory=apps/system/auth-service
pnpm nx g @nx/nest:app system-service --directory=apps/system/system-service
pnpm nx g @nx/nest:app tenant-service --directory=apps/system/tenant-service
```

#### 3. 각 서비스 설정
각 `main.ts` 파일 수정:
- 포트 설정
- Swagger 설정
- ValidationPipe 추가

#### 4. 테스트
```bash
pnpm nx serve auth-service
# http://localhost:3001/health 확인
# http://localhost:3001/api 확인 (Swagger)
```

#### 5. 완료 보고
사용자에게 완료 사실 알리고, `task.md` 업데이트.

---

## 6. 참조 문서

- **AI 페르소나**: [`vibe_coding.md`](./vibe_coding.md)
- **프로젝트 구조**: [`project_context.md`](./project_context.md)
- **코딩 컨벤션**: [`../human/coding_convention.md`](../human/coding_convention.md)
