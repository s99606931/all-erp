---
description: AI가 리팩토링 태스크를 실행하는 방법
---

# 리팩토링 태스크 실행 워크플로우

## 시작 전 확인
1. `docs/refactoring/README.md` 확인 - 전체 진행 상황 파악
2. 현재 진행할 Phase 문서 확인

## 태스크 실행 순서

// turbo-all
### Phase 1: 코드 품질 진단
```bash
# 1. reports 폴더 생성 (이미 생성되어 있음)
mkdir -p docs/refactoring/reports

# 2. ESLint 전체 검사
pnpm nx run-many --target=lint --all 2>&1 | tee docs/refactoring/reports/eslint-report.txt

# 3. any 사용 현황
grep -r ": any" --include="*.ts" apps/ libs/ > docs/refactoring/reports/any-usage.txt

# 4. 테스트 커버리지
pnpm nx run-many --target=test --all --coverage 2>&1 | tee docs/refactoring/reports/coverage-report.txt

# 5. 중복 코드 검출
npx jscpd apps/ libs/ --reporters html,json --output docs/refactoring/reports/duplication/

# 6. 의존성 그래프
pnpm nx graph --file=docs/refactoring/reports/dependency-graph.html
```

### Phase 2: 코딩 컨벤션 통일
```bash
# 1. 전체 포맷팅
pnpm nx format:write

# 2. 린트 자동 수정
pnpm nx run-many --target=lint --all --fix
```
- 폴더 구조 점검은 수동으로 진행
- 한국어 주석 추가는 코드 수정 필요

### Phase 3~6
- 각 Phase 문서의 태스크를 순서대로 실행
- 각 태스크 완료 후 체크리스트 업데이트

## 완료 후
1. 해당 Phase 문서의 체크리스트 모두 `[x]` 표시
2. `docs/refactoring/README.md` 상태 업데이트
3. 사용자에게 완료 보고 (notify_user)
