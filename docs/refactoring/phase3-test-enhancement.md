# Phase 3: 테스트 강화 (2주)

> **목표**: 핵심 비즈니스 로직의 테스트 커버리지를 70% 이상으로 향상

---

## 1주차: 공통 라이브러리 및 인증 서비스

---

## Task 3.1: 공통 라이브러리 테스트 - util

### 대상
- `libs/shared/util/src/lib/`

### 테스트 대상 함수
| 파일 | 함수 | 현재 테스트 | 추가 필요 |
|------|------|------------|----------|
| `string-utils.ts` | 모든 함수 | [ ] 확인 | [ ] |
| `date-utils.ts` | 모든 함수 | [ ] 확인 | [ ] |
| `crypto-utils.ts` | 모든 함수 | [ ] 확인 | [ ] |

### 실행 명령어
```bash
cd /data/all-erp
pnpm nx test shared-util --coverage
```

### 완료 기준
- [ ] 커버리지 80% 이상 달성
- [ ] 엣지 케이스 테스트 추가

---

## Task 3.2: 공통 라이브러리 테스트 - domain

### 대상
- `libs/shared/domain/src/lib/`

### 테스트 대상
| 파일 | 테스트 내용 |
|------|------------|
| `api-response.dto.ts` | 응답 변환 테스트 |
| `business.exception.ts` | 예외 생성/변환 테스트 |
| `global-exception.filter.ts` | 필터 동작 테스트 |

### 완료 기준
- [ ] 커버리지 80% 이상 달성

---

## Task 3.3: 공통 라이브러리 테스트 - infra

### 대상
- `libs/shared/infra/src/lib/`

### 테스트 대상
| 파일 | 테스트 내용 |
|------|------------|
| `bootstrap/bootstrap.ts` | 부트스트랩 옵션 테스트 |
| `prisma/prisma.service.ts` | 연결/해제 테스트 |
| `http/base-http.client.ts` | HTTP 호출 모킹 테스트 |
| `logger/logger.service.ts` | 로그 레벨별 테스트 |

### 완료 기준
- [ ] 커버리지 70% 이상 달성

---

## Task 3.4: auth-service 단위 테스트 강화

### 대상
- `apps/system/auth-service/src/app/auth/`

### 테스트 시나리오
| 기능 | 테스트 케이스 |
|------|--------------|
| 로그인 | 성공, 잘못된 비밀번호, 존재하지 않는 사용자 |
| 토큰 갱신 | 유효한 리프레시 토큰, 만료된 토큰, 잘못된 토큰 |
| 로그아웃 | 토큰 무효화 확인 |
| 권한 검증 | 역할별 접근 제어 |

### 실행 명령어
```bash
cd /data/all-erp
pnpm nx test auth-service --coverage
```

### 완료 기준
- [ ] AuthService 커버리지 80% 이상
- [ ] AuthController 커버리지 70% 이상

---

## Task 3.5: tenant-service 단위 테스트 강화

### 대상
- `apps/system/tenant-service/src/app/tenant/`

### 테스트 시나리오
| 기능 | 테스트 케이스 |
|------|--------------|
| 테넌트 생성 | 성공, 중복 체크, 유효성 검증 |
| 테넌트 조회 | 단건/목록, 필터링 |
| 테넌트 수정 | 성공, 권한 검증 |
| 테넌트 삭제 | 소프트 삭제, 연관 데이터 처리 |

### 완료 기준
- [ ] TenantService 커버리지 70% 이상

---

## Task 3.6: system-service 단위 테스트 강화

### 대상
- `apps/system/system-service/src/app/`

### 테스트 시나리오
- 공통 코드 CRUD
- 메뉴 관리
- 이벤트 핸들러

### 완료 기준
- [ ] 핵심 Service 커버리지 70% 이상

---

## 2주차: 비즈니스 서비스

---

## Task 3.7: personnel-service 단위 테스트 강화

### 대상
- `apps/hr/personnel-service/src/app/`

### 테스트 시나리오
| 기능 | 테스트 케이스 |
|------|--------------|
| 직원 등록 | 성공, 필수값 누락, 중복 |
| 직원 조회 | 단건, 목록, 검색 |
| 직원 수정 | 성공, 권한 검증 |
| 부서 관리 | CRUD, 계층 구조 |

### 완료 기준
- [ ] EmployeeService 커버리지 70% 이상

---

## Task 3.8: payroll-service 단위 테스트 강화

### 대상
- `apps/hr/payroll-service/src/app/payroll/`

### 테스트 시나리오 (핵심 로직)
| 기능 | 테스트 케이스 |
|------|--------------|
| 급여 계산 | 기본급, 수당, 공제 |
| 정산 처리 | 월별 정산, 연말정산 |
| 명세서 생성 | PDF 생성, 이메일 발송 |

### 완료 기준
- [ ] PayrollCalculator 커버리지 90% 이상 (핵심!)
- [ ] PayrollService 커버리지 70% 이상

---

## Task 3.9: accounting-service 단위 테스트 강화

### 대상
- `apps/finance/accounting-service/src/app/`

### 테스트 시나리오
| 기능 | 테스트 케이스 |
|------|--------------|
| 분개 처리 | 차변/대변 균형, 자동 분개 |
| 전표 생성 | 유효성 검증, 승인 워크플로우 |
| 결산 | 월결산, 연결산 |

### 완료 기준
- [ ] JournalService 커버리지 80% 이상

---

## Task 3.10: budget-service 단위 테스트 강화

### 대상
- `apps/finance/budget-service/src/app/`

### 테스트 시나리오
- 예산 편성
- 예산 집행
- 예산 대비 실적

### 완료 기준
- [ ] BudgetService 커버리지 70% 이상

---

## Task 3.11: 나머지 서비스 테스트 추가

### 대상
- `attendance-service`
- `settlement-service`
- `asset-service`
- `supply-service`
- `general-affairs-service`
- `approval-service`
- `report-service`

### 완료 기준
- [ ] 각 서비스 핵심 Service 커버리지 50% 이상

---

## Task 3.12: E2E 테스트 보강

### 대상
- `apps/*/\*-e2e/`

### 테스트 시나리오
| 서비스 | E2E 시나리오 |
|--------|-------------|
| auth-service | 로그인 → API 호출 → 로그아웃 |
| personnel-service | 직원 등록 → 조회 → 수정 → 삭제 |
| payroll-service | 급여 계산 → 정산 → 명세서 |

### 실행 명령어
```bash
# 인프라 먼저 실행
docker compose -f dev-environment/docker-compose.infra.yml up -d

# E2E 테스트
pnpm nx run-many --target=e2e --all
```

### 완료 기준
- [ ] 주요 3개 서비스 E2E 테스트 통과
- [ ] 나머지 서비스 기본 E2E 테스트 통과

---

## 📋 Phase 3 완료 체크리스트

### 1주차
- [ ] Task 3.1 ~ 3.3 완료 (공통 라이브러리)
- [ ] Task 3.4 ~ 3.6 완료 (시스템 도메인)

### 2주차
- [ ] Task 3.7 ~ 3.10 완료 (HR, Finance)
- [ ] Task 3.11 완료 (나머지 서비스)
- [ ] Task 3.12 완료 (E2E)
- [ ] 테스트 전략 문서 생성 (`checklists/test-strategy.md`)
- [ ] 전체 커버리지 보고서 생성
