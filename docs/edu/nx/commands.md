# NX 명령어 가이드

이 문서는 All-ERP 프로젝트에서 사용하는 NX 명령어에 대한 종합 가이드입니다.

## 📖 목차

- [기본 개념](#기본-개념)
- [프로젝트 관리](#프로젝트-관리)
- [빌드 및 실행](#빌드-및-실행)
- [테스트](#테스트)
- [코드 품질](#코드-품질)
- [의존성 그래프](#의존성-그래프)
- [캐시 관리](#캐시-관리)
- [고급 사용법](#고급-사용법)

---

## 기본 개념

NX는 모노레포(Monorepo) 프로젝트를 효율적으로 관리하기 위한 빌드 시스템입니다. 우리 프로젝트는 다음과 같은 구조로 구성되어 있습니다:

```
all-erp/
├── apps/                    # 애플리케이션 (서비스, 웹)
│   ├── auth-service/
│   ├── tenant-service/
│   └── web-admin/
├── libs/                    # 공유 라이브러리
│   └── shared/
│       ├── domain/
│       ├── infra/
│       └── util-tenancy/
```

---

## 프로젝트 관리

### 프로젝트 목록 보기

```bash
# 모든 프로젝트 목록 출력
pnpm nx show projects

# 특정 타입의 프로젝트만 보기
pnpm nx show projects --type app     # 애플리케이션만
pnpm nx show projects --type lib     # 라이브러리만
```

### 프로젝트 정보 확인

```bash
# 특정 프로젝트의 상세 정보
pnpm nx show project auth-service

# 프로젝트 설정 보기
pnpm nx show project auth-service --web
```

---

## 빌드 및 실행

### 단일 프로젝트 빌드

```bash
# 특정 프로젝트 빌드
pnpm nx build auth-service

# 개발 모드로 실행
pnpm nx serve auth-service

# watch 모드로 빌드
pnpm nx build auth-service --watch
```

### 여러 프로젝트 동시 빌드

```bash
# 모든 프로젝트 빌드
pnpm nx run-many -t build --all

# 특정 프로젝트들만 빌드
pnpm nx run-many -t build --projects=auth-service,tenant-service

# 영향받은 프로젝트만 빌드 (변경사항 기준)
pnpm nx affected -t build
```

### 병렬 실행 제어

```bash
# 최대 3개 프로젝트 동시 실행
pnpm nx run-many -t build --all --parallel=3

# 모든 CPU 코어 사용
pnpm nx run-many -t build --all --parallel
```

---

## 테스트

### 단위 테스트

```bash
# 단일 프로젝트 테스트
pnpm nx test auth-service

# watch 모드로 테스트
pnpm nx test auth-service --watch

# 커버리지 포함
pnpm nx test auth-service --coverage
```

### 전체 테스트

```bash
# 모든 프로젝트 테스트
pnpm nx run-many -t test --all

# 커버리지 포함하여 모든 프로젝트 테스트
pnpm nx run-many -t test --all --coverage

# 영향받은 프로젝트만 테스트
pnpm nx affected -t test
```

### E2E 테스트

```bash
# E2E 테스트 실행
pnpm nx e2e auth-service-e2e

# 모든 E2E 테스트 실행
pnpm nx run-many -t e2e --all
```

---

## 코드 품질

### Lint (문법 검사)

```bash
# 단일 프로젝트 lint
pnpm nx lint auth-service

# 자동 수정
pnpm nx lint auth-service --fix

# 모든 프로젝트 lint
pnpm nx run-many -t lint --all

# 영향받은 프로젝트만 lint
pnpm nx affected -t lint
```

### Format (코드 포맷팅)

```bash
# 프로젝트 포맷팅
pnpm nx format:write

# 포맷팅 확인만 (변경 없음)
pnpm nx format:check

# 변경된 파일만 포맷팅
pnpm nx format:write --uncommitted
```

---

## 의존성 그래프

### 그래프 시각화

```bash
# 전체 프로젝트 의존성 그래프 보기 (웹 브라우저)
pnpm nx graph

# 특정 프로젝트의 의존성만 보기
pnpm nx graph --focus=auth-service

# 영향받은 프로젝트 그래프
pnpm nx affected:graph
```

### 의존성 확인

```bash
# 특정 프로젝트가 의존하는 프로젝트들
pnpm nx show project auth-service --json | grep -A 100 "implicitDependencies"

# 리버스 의존성 (어떤 프로젝트가 이것을 사용하는지)
pnpm nx graph --focus=domain
```

---

## 캐시 관리

NX는 빌드 결과를 캐싱하여 성능을 향상시킵니다.

### 캐시 확인 및 제어

```bash
# 캐시 무시하고 실행
pnpm nx build auth-service --skip-nx-cache

# 캐시 초기화
pnpm nx reset

# 캐시 통계 확인
pnpm nx daemon --stop
pnpm nx daemon
```

---

## 고급 사용법

### Affected Commands (변경 영향 분석)

```bash
# main 브랜치와 비교하여 영향받은 프로젝트 확인
pnpm nx affected:graph

# 특정 브랜치와 비교
pnpm nx affected -t build --base=develop

# 특정 커밋과 비교
pnpm nx affected -t test --base=HEAD~1
```

### 타겟 실행 옵션

```bash
# verbose 모드 (상세 로그)
pnpm nx build auth-service --verbose

# 설정 출력
pnpm nx build auth-service --configuration=production

# 출력 경로 지정
pnpm nx build auth-service --outputPath=dist/custom
```

### 여러 타겟 동시 실행

```bash
# lint와 test를 동시에 실행
pnpm nx run-many -t lint,test --all

# build, test, lint 순차 실행
pnpm nx run-many -t build,test,lint --projects=auth-service
```

---

## 실전 예제

### 개발 워크플로우

```bash
# 1. 변경사항이 있는 프로젝트 확인
pnpm nx affected:graph

# 2. 영향받은 프로젝트 lint
pnpm nx affected -t lint --fix

# 3. 영향받은 프로젝트 테스트
pnpm nx affected -t test

# 4. 영향받은 프로젝트 빌드
pnpm nx affected -t build
```

### CI/CD에서 사용

```bash
# PR에서 변경된 부분만 검증
pnpm nx affected -t lint,test,build --base=origin/main --head=HEAD

# 병렬 실행으로 성능 최적화
pnpm nx affected -t test --base=origin/main --parallel=3
```

### 특정 서비스 개발

```bash
# auth-service만 개발 모드로 실행
pnpm nx serve auth-service

# auth-service와 의존하는 라이브러리 watch 모드
pnpm nx build auth-service --watch

# 변경 시 자동으로 테스트
pnpm nx test auth-service --watch
```

---

## 문제 해결

### 캐시 문제

```bash
# 캐시 초기화
pnpm nx reset

# daemon 재시작
pnpm nx daemon --stop
pnpm nx daemon
```

### 의존성 문제

```bash
# 의존성 그래프 다시 생성
pnpm nx reset
pnpm nx graph
```

### 빌드 실패

```bash
# verbose 모드로 상세 로그 확인
pnpm nx build auth-service --verbose

# 캐시 무시하고 재빌드
pnpm nx build auth-service --skip-nx-cache
```

---

## 유용한 팁

### 별칭 설정 (선택사항)

`.bashrc` 또는 `.zshrc`에 추가:

```bash
alias nxb='pnpm nx build'
alias nxt='pnpm nx test'
alias nxl='pnpm nx lint'
alias nxs='pnpm nx serve'
alias nxg='pnpm nx graph'
```

### 자주 사용하는 명령어

```bash
# 전체 프로젝트 품질 검사
pnpm nx run-many -t lint,test --all

# 빠른 검증 (변경된 부분만)
pnpm nx affected -t lint,test

# 프로젝트 클린 빌드
pnpm nx reset && pnpm nx build auth-service
```

---

## 참고 자료

- [NX 공식 문서](https://nx.dev)
- [프로젝트 컨텍스트](../../ai/project_context.md)
- [코드 품질 검사 스크립트](../../dev-environment/scripts/README.md)

---

**작성일**: 2025-12-03  
**버전**: 1.0.0
