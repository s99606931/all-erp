# NX 학습 가이드

All-ERP 프로젝트에서 NX를 사용하기 위한 학습 자료 모음입니다.

## 📚 학습 순서

초급 개발자는 다음 순서로 문서를 학습하는 것을 권장합니다:

### 1단계: 기본 이해

- [NX 아키텍처 가이드](./architecture.md) 읽기
  - NX가 무엇인지 이해
  - 모노레포 아키텍처 파악
  - 프로젝트 구조와 의존성 관리 학습

### 2단계: 실전 명령어

- [NX 명령어 가이드](./commands.md) 읽기
  - 기본 CRUD 명령어 실습
  - Affected 명령어 활용
  - 캐싱과 최적화 이해

### 3단계: 프로젝트 탐색

- 프로젝트 의존성 그래프 확인
  ```bash
  pnpm nx graph
  ```
- 실제 프로젝트 구조 분석
  ```bash
  pnpm nx show projects
  ```

## 🎯 빠른 시작

### 필수 명령어

```bash
# 프로젝트 목록 확인
pnpm nx show projects

# 특정 서비스 빌드
pnpm nx build auth-service

# 의존성 그래프 보기
pnpm nx graph

# 영향받은 프로젝트만 테스트
pnpm nx affected -t test
```

### 첫 번째 프로젝트 빌드

```bash
# 1. 프로젝트 확인
pnpm nx show project auth-service

# 2. 빌드 실행
pnpm nx build auth-service

# 3. 빌드 결과 확인
ls dist/apps/auth-service
```

## 📖 문서 목록

| 문서                                 | 설명                               | 대상        |
| ------------------------------------ | ---------------------------------- | ----------- |
| [아키텍처 가이드](./architecture.md) | NX 아키텍처, 모노레포, 의존성 관리 | 전체 개발자 |
| [명령어 가이드](./commands.md)       | NX 명령어 사용법, 실전 예제        | 초급~중급   |

## 🔍 주요 개념

### Monorepo (모노레포)

여러 프로젝트를 하나의 저장소에서 관리하는 방식입니다.

```
all-erp/
├── apps/          # 독립 실행 가능한 애플리케이션
└── libs/          # 공유 라이브러리
```

### Affected Commands

변경사항에 영향받는 프로젝트만 선택적으로 작업합니다.

```bash
# auth-service를 수정했다면
# 영향받은 프로젝트만 테스트
pnpm nx affected -t test
```

### Computation Caching

이전 빌드 결과를 재사용하여 빌드 시간을 단축합니다.

```bash
# 캐시가 있으면 즉시 완료
pnpm nx build auth-service
# ✔  nx run auth-service:build [existing outputs match the cache]
```

## 💡 실전 시나리오

### 시나리오 1: 새로운 기능 개발

```bash
# 1. 변경 영향 확인
pnpm nx affected:graph

# 2. 영향받은 프로젝트 린트
pnpm nx affected -t lint

# 3. 영향받은 프로젝트 테스트
pnpm nx affected -t test

# 4. 빌드
pnpm nx affected -t build
```

### 시나리오 2: 특정 서비스 디버깅

```bash
# 개발 모드로 실행
pnpm nx serve auth-service

# watch 모드로 테스트
pnpm nx test auth-service --watch

# verbose 모드로 빌드
pnpm nx build auth-service --verbose
```

### 시나리오 3: 전체 프로젝트 검증

```bash
# 모든 프로젝트 lint + test
pnpm nx run-many -t lint,test --all

# 병렬 실행으로 빠르게
pnpm nx run-many -t lint,test --all --parallel=3
```

## 🔗 외부 자료

- [NX 공식 문서](https://nx.dev)
- [NX Getting Started](https://nx.dev/getting-started/intro)
- [NX Video Tutorials](https://www.youtube.com/c/Nrwl_io)

## ❓ 자주 묻는 질문

### Q: build와 serve의 차이는?

- **build**: 프로덕션용 빌드 생성 (`dist/` 폴더에 저장)
- **serve**: 개발 모드로 실행 (Hot Reload 지원)

### Q: affected는 언제 사용하나요?

- PR 검증, CI/CD 파이프라인에서 주로 사용
- 변경된 파일에 영향받는 프로젝트만 처리하여 시간 절약

### Q: 캐시는 어떻게 동작하나요?

- 소스 코드, 설정 파일, 의존성이 동일하면 캐시 사용
- `.nx/cache/` 디렉토리에 저장
- `pnpm nx reset`으로 초기화 가능

### Q: 프로젝트 간 의존성은 어떻게 관리하나요?

- NX가 자동으로 의존성 그래프를 생성
- `pnpm nx graph`로 시각화
- 순환 의존성은 자동으로 감지 및 경고

---

**작성일**: 2025-12-03  
**버전**: 1.0.0
