# 코드 품질 진단 종합 보고서

> **진단 일시**: 2025-12-06  
> **대상**: ALL-ERP 전체 프로젝트 (49개 프로젝트)

---

## 📊 요약 (Executive Summary)

| 지표                | 현황                       | 등급       |
| ------------------- | -------------------------- | ---------- |
| **전체 품질 등급**  | -                          | **C**      |
| ESLint 검사         | 49개 프로젝트 중 12개 실패 | ⚠️ 주의    |
| TypeScript any 사용 | 51개 위치                  | ⚠️ 주의    |
| 테스트 커버리지     | 15개 서비스 실패           | 🔴 심각    |
| 의존성 그래프       | 정상 생성                  | ✅ 양호    |
| 중복 코드 검출      | 실행 중 (대용량 분석)      | ⏳ 진행 중 |

### 🎯 핵심 발견사항

1. **프론트엔드 린트 에러 집중**: 12개 프론트엔드 프로젝트에서 ESLint 에러 발생
2. **Prisma 타입 문제**: Database per Service 전환으로 인한 타입 불일치
3. **테스트 실패 다수**: 15개 서비스에서 테스트 실패 (대부분 Prisma 관련)

---

## 1. ESLint 검사 결과

### ✅ 정리표

**통과 프로젝트**: 37개  
**실패 프로젝트**: 12개

### 🔴 실패 프로젝트 목록

| 프로젝트            | 에러 | 경고 | 주요 이슈                          |
| ------------------- | ---- | ---- | ---------------------------------- |
| hr-mfe              | 2    | 1    | `no-inferrable-types`              |
| system-mfe          | 2    | 1    | `no-inferrable-types`              |
| events              | 1    | 0    | 의존성 누락 (uuid, @nestjs/\*)     |
| payroll-mfe         | 2    | 1    | `no-inferrable-types`              |
| accounting-mfe      | 3    | 1    | `@ts-nocheck` 사용                 |
| attendance-mfe      | 2    | 2    | `no-inferrable-types`, 미사용 변수 |
| general-affairs-mfe | 0    | 8    | `any` 타입 과다 사용               |
| treasury-mfe        | 2    | 1    | `no-inferrable-types`              |
| budget-mfe          | 2    | 1    | `no-inferrable-types`              |
| inventory-mfe       | 0    | 5    | `any` 타입 과다 사용               |
| shell               | 2    | 0    | 모듈 누락 (globals)                |
| asset-mfe           | 0    | 5    | `any` 타입 과다 사용               |

### 📌 공통 패턴

1. **프론트엔드 MFE**: `utils.ts`에서 타입 추론 문제 반복
2. **의존성 문제**: `events` 라이브러리, `shell` 앱의 package.json 의존성 누락
3. **타입 안전성**: 공통 컴포넌트에서 `any` 타입 과다 사용

---

## 2. TypeScript `any` 타입 사용 현황

### 📊 통계

- **총 발견 개수**: 51개
- **주요 발생 위치**:
  - `libs/shared/infra`: 11개 (Prisma, Event 관련)
  - Backend Services: 30개 (Controller, Service, Event Handler)
  - Frontend MFE: 10개 (공통 컴포넌트)

### 🎯 개선 우선순위

| 우선순위 | 위치              | 개수 | 이유               |
| -------- | ----------------- | ---- | ------------------ |
| **높음** | libs/shared/infra | 11   | 전체 서비스에 영향 |
| **중간** | Backend Services  | 30   | 서비스별 고립      |
| **낮음** | Frontend MFE      | 10   | UI 레이어          |

### 📝 주요 파일

1. `/libs/shared/infra/src/lib/event/outbox.repository.interface.ts` (4개)
2. `/libs/shared/infra/src/lib/prisma/prisma.service.spec.ts` (3개)
3. `/apps/platform/report-service/src/app/report/report-generator.service.ts` (7개)

---

## 3. 테스트 커버리지 분석

### 🔴 테스트 실패 서비스 (15개)

| 서비스                  | 상태 | 주요 에러                          |
| ----------------------- | ---- | ---------------------------------- |
| infra (shared)          | ❌   | PrismaService 메서드 누락          |
| tenant-service          | ❌   | `prisma.tenant` 타입 없음          |
| asset-service           | ❌   | `prisma.asset` 타입 없음           |
| auth-service            | ❌   | Role import 실패                   |
| budget-service          | ❌   | Prisma 타입 누락                   |
| accounting-service      | ❌   | journalEntry 타입 없음             |
| general-affairs-service | ❌   | vehicleReservation 타입 없음       |
| settlement-service      | ❌   | journalEntryLine 타입 없음         |
| supply-service          | ❌   | inventory 타입 없음                |
| attendance-service      | ❌   | leaveRequest, attendance 타입 없음 |
| system-service          | ❌   | commonCode, department 타입 없음   |
| personnel-service       | ❌   | employee 타입 없음                 |
| payroll-service         | ❌   | employee, payroll 타입 없음        |
| file-service            | ❌   | Jest preset 설정 오류              |
| report-service          | ❌   | report 타입 없음                   |

### ✅ 테스트 통과 서비스 (7개)

- config, domain, events, tenancy, util
- approval-service, ai-service

### 🎯 근본 원인

**Database per Service 아키텍처 전환 후 Prisma Client 타입 불일치**

- 각 서비스별 독립 Prisma Client 사용 필요
- 테스트 코드가 공통 `@prisma/client` import 사용
- 서비스별 `.prisma/{service}-client` import로 변경 필요

---

## 4. 의존성 그래프

### ✅ 생성 결과

- **파일**: [ docs/refactoring/reports/dependency-graph.html`
- **상태**: 정상 생성 완료
- **프로젝트 수**: 49개

### 📊 분석 (수동 확인 필요)

다음 항목은 HTML 파일을 열어 직접 확인이 필요합니다:

- [ ] 순환 참조 여부
- [ ] 비정상적인 의존성 패턴
- [ ] Micro Frontend 간 의존성

---

## 5. 중복 코드 검출

### ⏳ 진행 상황

- **상태**: 백그라운드 실행 중
- **지연 원인**: node_modules 포함한 전체 스캔
- **예상 완료**: 진행 중
- **산출물 경로**: `docs/refactoring/reports/duplication/`

> 💡 **제안**: 다음 분석 시 apps/ libs/ 소스만 대상으로 제한

---

## 6. 개선 우선순위

### 🔥 긴급 (High Priority)

1. **Database per Service 타입 문제 해결**

   - 각 서비스별 Prisma Client import 수정
   - 테스트 코드 Prisma import 경로 수정
   - 영향도: 15개 서비스

2. **프론트엔드 린트 에러 수정**

   - utils.ts 타입 추론 문제 (10개 MFE)
   - shell ESLint 설정 수정 (globals 의존성)
   - 영향도: 12개 프로젝트

3. **의존성 누락 해결**
   - events 라이브러리 package.json 수정
   - 필요 패키지: uuid, @nestjs/common, @nestjs/microservices
   - 영향도: 전체 프로젝트

### ⚠️ 중요 (Medium Priority)

4. **any 타입 제거**

   - libs/shared/infra 우선 처리 (11개)
   - 타입 정의 추가 및 인터페이스 개선
   - 점진적 마이그레이션 (단계별 적용)

5. **테스트 커버리지 향상**
   - 통과한 서비스 참고하여 패턴 수립
   - Database per Service 대응 테스트 가이드 작성

### 📝 일반 (Low Priority)

6. **중복 코드 리팩토링**

   - jscpd 결과 확인 후 진행
   - 공통 컴포넌트 추출

7. **코드 품질 지표 모니터링**
   - CI/CD에 품질 게이트 추가
   - SonarQube 등 정적 분석 도구 도입 검토

---

## 7. 다음 단계

### 즉시 조치 항목

```bash
# 1. 프론트엔드 린트 자동 수정
pnpm nx run-many --target=lint --all --fix

# 2. 의존성 추가 (events)
cd libs/shared/events
pnpm add uuid @nestjs/common @nestjs/microservices

#  3. shell globals 의존성 추가
cd apps/frontend/shell
pnpm add -D globals
```

### Phase 2 준비

Phase 1 완료 후 Phase 2 (코딩 컨벤션 통일)로 진행:

- 자동 포맷팅 적용
- 폴더 구조 점검
- 한국어 주석 추가

---

## 📎 첨부 파일

- [eslint-report.txt](file:///data/all-erp/docs/refactoring/reports/eslint-report.txt)
- [any-usage.txt](file:///data/all-erp/docs/refactoring/reports/any-usage.txt)
- [coverage-report.txt](file:///data/all-erp/docs/refactoring/reports/coverage-report.txt)
- [dependency-graph.html](file:///data/all-erp/docs/refactoring/reports/dependency-graph.html)

---

**작성자**: Gemini AI  
**검토 필요**: ✅ 사용자 승인 필요
