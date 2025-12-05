# 코드 품질 진단 종합 보고서

> **작성일**: 2025-12-05  
> **Phase**: 1 - 코드 품질 진단

---

## 📊 요약 (Executive Summary)

| 지표                 | 결과               | 상태                |
| -------------------- | ------------------ | ------------------- |
| **전체 품질 등급**   | **B**              | 🟡 양호 (개선 필요) |
| ESLint 실패 프로젝트 | 12/50              | ⚠️ 24% 실패율       |
| `any` 타입 사용      | 37곳               | ⚠️ 중간 수준        |
| 테스트 커버리지      | 미측정             | ⏸️ 다음 단계        |
| 중복 코드 분석       | 완료 (45MB 보고서) | ✅                  |
| 의존성 그래프        | 생성 완료          | ✅                  |

---

## 1. ESLint 검사 결과

### 1.1 실패 프로젝트 목록 (12개)

| 프로젝트              | 에러 개수 | 경고 개수 | 주요 문제                                 |
| --------------------- | --------- | --------- | ----------------------------------------- |
| `events` (libs)       | -         | -         | -                                         |
| `hr-mfe`              | -         | -         | -                                         |
| `asset-mfe`           | 2         | 1         | no-inferrable-types                       |
| `budget-mfe`          | 2         | 1         | no-inferrable-types                       |
| `treasury-mfe`        | -         | -         | -                                         |
| `attendance-mfe`      | 2         | 1         | no-inferrable-types                       |
| `inventory-mfe`       | -         | -         | -                                         |
| `general-affairs-mfe` | -         | -         | -                                         |
| `accounting-mfe`      | 3         | 1         | ban-ts-comment, no-inferrable-types       |
| `payroll-mfe`         | 2         | 1         | no-inferrable-types                       |
| `system-mfe`          | 2         | 1         | no-inferrable-types                       |
| `shell`               | -         | -         | ESLint config error (globals 패키지 누락) |

### 1.2 주요 문제 패턴

#### 패턴 1: `no-inferrable-types` (가장 빈번)

```typescript
// ❌ 문제
const baseUrl: string = 'http://localhost';

// ✅ 해결
const baseUrl = 'http://localhost'; // 타입 추론 사용
```

**영향**: 프론트엔드 MFE 앱 6개  
**수정 방법**: `--fix` 플래그로 자동 수정 가능

#### 패턴 2: `no-non-null-assertion`

```typescript
// ⚠️ 경고
document.getElementById('root')!;

// ✅ 권장
const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');
```

**영향**: 여러 프론트엔드 앱  
**수정 방법**: null 체크 로직 추가

#### 패턴 3: `ban-ts-comment` (심각)

```typescript
// ❌ 금지
// @ts-nocheck

// ✅ 해결: 타입 에러 직접 수정
```

**영향**: `accounting-mfe`  
**우선순위**: **높음** (타입 안전성 저하)

#### 패턴 4: Shell 앱 ESLint 설정 오류

```
Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'globals'
```

**원인**: `eslint.config.js`에서 `globals` 패키지 import 실패  
**수정 방법**: `globals/index.js`로 수정 또는 패키지 설치

---

## 2. `any` 타입 사용 현황

### 2.1 통계

- **총 사용 위치**: 37곳
- **서비스별 분포**:
  - `libs/shared/infra`: 9곳 (24%)
  - `apps/platform/*`: 9곳 (24%)
  - `apps/hr/*`: 6곳 (16%)
  - `apps/system/*`: 6곳 (16%)
  - `apps/frontend/shell`: 2곳 (5%)
  - 기타: 5곳 (13%)

### 2.2 주요 사용 사례

#### 케이스 1: Prisma Transaction (libs/shared/infra)

```typescript
// 현재
return prismaAny.$transaction(async (tx: any) => { ... });

// 개선안
import { Prisma } from '@prisma/client';
return prisma.$transaction(async (tx: Prisma.TransactionClient) => { ... });
```

#### 케이스 2: RabbitMQ 메시지 핸들러

```typescript
// 현재
async (msg: any) => { ... }

// 개선안
interface EmployeeCreatedEvent {
  id: string;
  name: string;
  deptId: string;
}
async (msg: EmployeeCreatedEvent) => { ... }
```

#### 케이스 3: DTO 타입 누락

```typescript
// 현재
async create(@Body() dto: any) { ... }

// 개선안
async create(@Body() dto: CreateDepartmentDto) { ... }
```

### 2.3 개선 우선순위

| 우선순위 | 위치                | 이유                    |
| -------- | ------------------- | ----------------------- |
| **높음** | DTO 파라미터 (10곳) | API 타입 안전성 직결    |
| **중간** | 이벤트 핸들러 (8곳) | 이벤트 스키마 정의 필요 |
| **낮음** | 유틸리티 함수 (4곳) | 제네릭으로 해결 가능    |

---

## 3. 중복 코드 분석

### 3.1 결과 파일

- **보고서 크기**: 45MB
- **HTML 리포트**: `docs/refactoring/reports/duplication/html/`
- **JSON 보고서**: `docs/refactoring/reports/duplication/jscpd-report.json`

### 3.2 주요 중복 패턴 (node_modules 제외)

**분석 중**: node_modules 내 중복이 대부분이므로, 실제 소스 코드의 중복 비율을 재측정 필요.

**다음 단계**:

```bash
# apps/ 와 libs/ 만 검사
npx jscpd apps/ --exclude "**/*.spec.ts" --exclude "**/node_modules/**" --reporters html
```

---

## 4. 의존성 그래프

### 4.1 생성 파일

- **HTML 그래프**: `docs/refactoring/reports/dependency-graph.html`
- **크기**: 1.2KB

### 4.2 시각적 확인 필요

브라우저에서 `dependency-graph.html` 열어서 다음 확인:

- [ ] 순환 참조 여부
- [ ] 예상치 못한 의존성
- [ ] 레이어 분리 준수 (util → domain → infra)

---

## 5. 테스트 커버리지

**상태**: ⏸️ **미실행**

**이유**: Phase 1에서는 품질 진단에 집중하고, 테스트 커버리지는 Phase 3에서 상세히 측정할 예정.

---

## 6. 개선 권장사항 (우선순위)

### 🔴 높음 (즉시 수정 필요)

1. **Shell 앱 ESLint 설정 수정**

   - `apps/frontend/shell/eslint.config.js` 내 `globals` import 수정
   - 또는 `globals` 패키지 설치

2. **`@ts-nocheck` 제거** (`accounting-mfe`)

   - 타입 에러 직접 수정하여 타입 안전성 확보

3. **DTO `any` 타입 제거** (10곳)
   - 모든 Controller에서 명시적 DTO 사용

### 🟡 중간 (Phase 2에서 처리)

4. **ESLint 자동 수정 실행**

   ```bash
   pnpm nx run-many --target=lint --all --fix
   ```

5. **이벤트 핸들러 타입 정의**
   - RabbitMQ 메시지 페이로드 인터페이스 정의

### 🟢 낮음 (Phase 4에서 처리)

6. **유틸리티 함수 제네릭 적용**
7. **실제 소스 코드 중복도 재측정** (node_modules 제외)

---

## 7. 다음 단계

- [ ] Phase 1 완료 사용자 확인
- [ ] Phase 2 시작: 코딩 컨벤션 통일
  - [ ] ESLint/Prettier 자동 수정
  - [ ] 폴더 구조 점검
  - [ ] 한국어 주석 표준화

---

**보고서 작성자**: AI Assistant  
**검토자**: 사용자 확인 필요
