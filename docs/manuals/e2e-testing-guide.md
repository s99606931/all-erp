# E2E 테스트 실행 가이드

## 📋 개요

이 문서는 all-erp 프로젝트의 E2E 테스트, API 통합 테스트, 성능 테스트를 실행하는 방법을 설명합니다.

## 🛠 사전 요구사항

### 필수 설치
```bash
# Playwright 브라우저 설치
pnpm exec playwright install

# k6 설치 (성능 테스트용)
# Ubuntu/Debian
sudo apt-get install k6

# macOS
brew install k6
```

### 서비스 실행
E2E 테스트 실행 전 Docker Compose로 모든 서비스를 실행해야 합니다:

```bash
cd dev-environment

# 인프라 실행 (DB, Redis, RabbitMQ)
docker compose -f docker-compose.infra.yml up -d

# 백엔드 서비스 실행
docker compose -f docker-compose.dev.yml up -d

# 프론트엔드 실행
docker compose -f docker-compose.frontend.yml up -d
```

## 🧪 테스트 실행

### 1. E2E 테스트 (Playwright)

```bash
# 전체 E2E 테스트 실행
pnpm exec playwright test

# 특정 테스트 파일 실행
pnpm exec playwright test e2e/01-auth-flow.spec.ts

# UI 모드로 실행 (디버깅용)
pnpm exec playwright test --ui

# headed 모드 (브라우저 보기)
pnpm exec playwright test --headed

# 특정 브라우저만 실행
pnpm exec playwright test --project=chromium
```

### 2. API 통합 테스트 (Vitest)

```bash
# 통합 테스트 실행
pnpm vitest run --config vitest.integration.config.ts

# watch 모드
pnpm vitest --config vitest.integration.config.ts

# 커버리지 포함
pnpm vitest run --config vitest.integration.config.ts --coverage
```

### 3. 성능 테스트 (k6)

```bash
# 기본 실행
k6 run tests/load/approval-flow.js

# 환경 변수 설정
K6_BASE_URL=http://localhost k6 run tests/load/approval-flow.js

# 결과 저장
k6 run --out json=results.json tests/load/approval-flow.js
```

## 📊 테스트 리포트

### Playwright 리포트
```bash
# HTML 리포트 확인
pnpm exec playwright show-report

# 스크린샷은 test-results/ 디렉토리에 저장됨
```

### k6 리포트
- 실행 후 콘솔에 요약 출력
- `tests/load/approval-flow-summary.json`에 상세 결과 저장

## 📁 테스트 파일 구조

```
/data/all-erp
├── e2e/                              # E2E 테스트 (Playwright)
│   ├── 01-auth-flow.spec.ts         # 인증 흐름
│   ├── 02-employee-crud.spec.ts     # 직원 관리 (Cross-Service)
│   ├── 03-approval-flow.spec.ts     # 결재 흐름 (Multi-Service Saga)
│   ├── 04-dashboard.spec.ts         # 대시보드
│   ├── 05-navigation.spec.ts        # 네비게이션
│   ├── 06-form-validation.spec.ts   # 폼 유효성 검사
│   ├── 07-data-table.spec.ts        # 데이터 테이블
│   ├── 08-search.spec.ts            # 검색 기능
│   ├── 09-error-handling.spec.ts    # 에러 처리
│   └── 10-responsive.spec.ts        # 반응형 디자인
├── tests/
│   ├── integration/                  # API 통합 테스트
│   │   └── services.test.ts         # 서비스 간 통신 테스트
│   └── load/                         # 성능 테스트
│       └── approval-flow.js         # k6 부하 테스트
├── playwright.config.ts              # Playwright 설정
└── vitest.integration.config.ts      # Vitest 통합 테스트 설정
```

## ⚠️ 주의사항

1. **테스트 데이터 격리**: 테스트 실행 시 별도의 테넌트 또는 테스트용 데이터를 사용하세요.
2. **이벤트 전파 시간**: 서비스 간 비동기 통신 시 적절한 대기 시간을 고려하세요.
3. **CI/CD 환경**: CI에서는 `--forbid-only` 플래그가 자동 적용됩니다.
4. **성능 테스트 환경**: k6 테스트는 운영과 유사한 리소스 환경에서 실행하세요.

## 🔗 참고 문서

- [Playwright 공식 문서](https://playwright.dev/)
- [Vitest 공식 문서](https://vitest.dev/)
- [k6 공식 문서](https://k6.io/docs/)
