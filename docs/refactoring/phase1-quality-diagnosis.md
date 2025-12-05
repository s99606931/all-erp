# Phase 1: 코드 품질 진단 (1주)

> **목표**: 현재 코드베이스의 품질 상태를 객관적으로 측정하고 개선 대상 식별

---

## Task 1.1: ESLint 전체 검사 및 보고서 생성

### 실행 명령어
```bash
cd /data/all-erp
pnpm nx run-many --target=lint --all 2>&1 | tee docs/refactoring/reports/eslint-report.txt
```

### 완료 기준
- [ ] 전체 서비스 린트 실행 완료
- [ ] `docs/refactoring/reports/eslint-report.txt` 생성
- [ ] 에러 개수 및 경고 개수 기록

### 산출물
| 파일 | 설명 |
|------|------|
| `reports/eslint-report.txt` | ESLint 전체 결과 |
| `reports/eslint-summary.md` | 에러/경고 요약 |

---

## Task 1.2: TypeScript any 사용 현황 파악

### 실행 명령어
```bash
cd /data/all-erp
grep -r "any" --include="*.ts" apps/ libs/ | grep -v "node_modules" | wc -l
grep -r ": any" --include="*.ts" apps/ libs/ > docs/refactoring/reports/any-usage.txt
```

### 완료 기준
- [ ] `any` 타입 사용 위치 전체 목록 생성
- [ ] 서비스별 `any` 사용 개수 집계

### 산출물
| 파일 | 설명 |
|------|------|
| `reports/any-usage.txt` | any 사용 위치 목록 |
| `reports/any-summary.md` | 서비스별 집계 |

---

## Task 1.3: 테스트 커버리지 측정

### 실행 명령어
```bash
cd /data/all-erp
pnpm nx run-many --target=test --all --coverage 2>&1 | tee docs/refactoring/reports/coverage-report.txt
```

### 완료 기준
- [ ] 전체 테스트 실행 완료
- [ ] 커버리지 리포트 생성
- [ ] 서비스별 커버리지 % 기록

### 산출물
| 파일 | 설명 |
|------|------|
| `reports/coverage-report.txt` | 전체 커버리지 결과 |
| `reports/coverage-summary.md` | 서비스별 커버리지 요약 |

---

## Task 1.4: 중복 코드 검출 (jscpd)

### 실행 명령어
```bash
cd /data/all-erp
npx jscpd apps/ libs/ --reporters html,json --output docs/refactoring/reports/duplication/
```

### 완료 기준
- [ ] 중복 코드 검출 실행 완료
- [ ] HTML 리포트 생성
- [ ] 중복률 % 기록

### 산출물
| 파일 | 설명 |
|------|------|
| `reports/duplication/` | jscpd 결과 폴더 |
| `reports/duplication-summary.md` | 중복 코드 요약 |

---

## Task 1.5: 의존성 그래프 분석

### 실행 명령어
```bash
cd /data/all-erp
pnpm nx graph --file=docs/refactoring/reports/dependency-graph.html
```

### 완료 기준
- [ ] 의존성 그래프 생성
- [ ] 순환 참조 여부 확인
- [ ] 이상 의존성 기록

### 산출물
| 파일 | 설명 |
|------|------|
| `reports/dependency-graph.html` | 의존성 시각화 |
| `reports/dependency-issues.md` | 의존성 이슈 목록 |

---

## Task 1.6: 품질 진단 종합 보고서 작성

### 작업 내용
위 태스크 결과를 종합하여 보고서 작성

### 보고서 구성
1. **요약**: 전체 품질 점수 (A~F 등급)
2. **ESLint**: 에러/경고 개수 및 주요 패턴
3. **타입 안전성**: any 사용 현황
4. **테스트**: 커버리지 현황
5. **중복 코드**: 중복률 및 주요 중복 영역
6. **의존성**: 순환 참조 및 이상 패턴
7. **개선 우선순위**: 높음/중간/낮음 분류

### 완료 기준
- [ ] `docs/refactoring/reports/quality-diagnosis-report.md` 작성 완료

---

## 📋 Phase 1 완료 체크리스트

- [ ] Task 1.1 완료
- [ ] Task 1.2 완료
- [ ] Task 1.3 완료
- [ ] Task 1.4 완료
- [ ] Task 1.5 완료
- [ ] Task 1.6 완료
- [ ] 종합 보고서 사용자 리뷰 완료
