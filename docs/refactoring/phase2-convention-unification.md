# Phase 2: 코딩 컨벤션 통일 (1주)

> **목표**: 전체 서비스에 일관된 코딩 스타일 적용

---

## Task 2.1: ESLint/Prettier 설정 표준화

### 작업 내용
1. `eslint.config.mjs` 규칙 강화
2. `.prettierrc` 설정 확인 및 통일
3. 전체 코드 포맷팅

### 실행 명령어
```bash
cd /data/all-erp
pnpm nx format:write
pnpm nx run-many --target=lint --all --fix
```

### 완료 기준
- [ ] ESLint 규칙 업데이트
- [ ] 전체 포맷팅 적용
- [ ] 린트 에러 0개 또는 허용 범위 내

---

## Task 2.2: 백엔드 폴더 구조 점검 (system 도메인)

### 대상 서비스
- `apps/system/auth-service`
- `apps/system/system-service`
- `apps/system/tenant-service`

### 점검 항목
| 항목 | 표준 | 점검 |
|------|------|------|
| Controller | `app/api/*.controller.ts` | [ ] |
| Service | `app/domain/*.service.ts` | [ ] |
| Repository | `app/infra/*.repository.ts` | [ ] |
| DTO | `app/api/dto/*.dto.ts` 또는 `app/domain/dto/*.dto.ts` | [ ] |
| 모듈 | `app/*.module.ts` | [ ] |

### 실행 작업
```bash
# 폴더 구조 점검 스크립트 실행
ls -la apps/system/*/src/app/
```

### 완료 기준
- [ ] 3개 서비스 폴더 구조 점검 완료
- [ ] 비표준 구조 목록 작성
- [ ] 필요시 폴더 재구성

---

## Task 2.3: 백엔드 폴더 구조 점검 (hr 도메인)

### 대상 서비스
- `apps/hr/personnel-service`
- `apps/hr/payroll-service`
- `apps/hr/attendance-service`

### 점검 항목
동일 (Task 2.2 참조)

### 완료 기준
- [ ] 3개 서비스 폴더 구조 점검 완료
- [ ] 비표준 구조 수정

---

## Task 2.4: 백엔드 폴더 구조 점검 (finance 도메인)

### 대상 서비스
- `apps/finance/budget-service`
- `apps/finance/accounting-service`
- `apps/finance/settlement-service`

### 완료 기준
- [ ] 3개 서비스 폴더 구조 점검 완료

---

## Task 2.5: 백엔드 폴더 구조 점검 (general 도메인)

### 대상 서비스
- `apps/general/asset-service`
- `apps/general/supply-service`
- `apps/general/general-affairs-service`

### 완료 기준
- [ ] 3개 서비스 폴더 구조 점검 완료

---

## Task 2.6: 백엔드 폴더 구조 점검 (platform + ai 도메인)

### 대상 서비스
- `apps/platform/approval-service`
- `apps/platform/report-service`
- `apps/platform/notification-service`
- `apps/platform/file-service` (있는 경우)
- `apps/ai/ai-service`

### 완료 기준
- [ ] 5개 서비스 폴더 구조 점검 완료

---

## Task 2.7: 한국어 주석 표준화 (공통 라이브러리)

### 대상
- `libs/shared/config`
- `libs/shared/domain`
- `libs/shared/infra`
- `libs/shared/events`
- `libs/shared/tenancy`
- `libs/shared/util`

### 주석 표준
```typescript
/**
 * 사용자 정보를 조회합니다.
 *
 * @param userId - 사용자 ID
 * @returns 사용자 정보 객체
 * @throws {BusinessException} 사용자가 존재하지 않을 경우
 */
```

### 완료 기준
- [ ] 모든 public 함수에 한국어 JSDoc 추가
- [ ] 복잡한 로직에 인라인 주석 추가

---

## Task 2.8: 한국어 주석 표준화 (각 서비스 - system)

### 대상
- `apps/system/auth-service/src/app/`
- `apps/system/system-service/src/app/`
- `apps/system/tenant-service/src/app/`

### 작업 내용
- Controller 메서드 JSDoc 추가
- Service 메서드 JSDoc 추가
- 복잡한 비즈니스 로직 인라인 주석

### 완료 기준
- [ ] 3개 서비스 주석 표준화 완료

---

## Task 2.9: 한국어 주석 표준화 (각 서비스 - hr)

### 대상
- `apps/hr/personnel-service/src/app/`
- `apps/hr/payroll-service/src/app/`
- `apps/hr/attendance-service/src/app/`

### 완료 기준
- [ ] 3개 서비스 주석 표준화 완료

---

## Task 2.10: 한국어 주석 표준화 (각 서비스 - finance/general/platform)

### 대상
- 나머지 모든 서비스

### 완료 기준
- [ ] 나머지 서비스 주석 표준화 완료

---

## 📋 Phase 2 완료 체크리스트

- [ ] Task 2.1 완료 (ESLint/Prettier)
- [ ] Task 2.2 ~ 2.6 완료 (폴더 구조)
- [ ] Task 2.7 ~ 2.10 완료 (한국어 주석)
- [ ] 컨벤션 체크리스트 문서 생성 (`checklists/convention-checklist.md`)
