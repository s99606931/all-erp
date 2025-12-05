# Shell 앱

All-ERP Micro Frontend의 Host 역할을 하는 Shell 애플리케이션입니다.

## 🎯 개요

Shell 앱은 Module Federation을 사용하여 10개의 Remote 앱을 동적으로 로드하고 통합하는 Host 애플리케이션입니다.

## 🏗️ 아키텍처

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 5
- **Module Federation**: @originjs/vite-plugin-federation
- **Routing**: React Router v6
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **HTTP Client**: Axios

## 📦 Remote 앱

Shell 앱은 다음 10개의 Remote 앱을 통합합니다:

| 도메인 | Remote 앱 | 포트 |
|--------|-----------|------|
| System | system-mfe | 3100 |
| HR | hr-mfe | 3101 |
| Payroll | payroll-mfe | 3102 |
| Attendance | attendance-mfe | 3103 |
| Budget | budget-mfe | 3104 |
| Treasury | treasury-mfe | 3105 |
| Accounting | accounting-mfe | 3106 |
| Asset | asset-mfe | 3107 |
| Inventory | inventory-mfe | 3108 |
| General Affairs | general-affairs-mfe | 3109 |

## 🚀 시작하기

### 1. 의존성 설치

```bash
pnpm install
```

### 2. 환경 변수 설정

```bash
cp .env.example .env
```

### 3. 개발 서버 실행

```bash
pnpm dev
```

앱은 `http://localhost:3000`에서 실행됩니다.

### 4. 프로덕션 빌드

```bash
pnpm build
pnpm preview
```

## 📁 폴더 구조

```
shell/
├── src/
│   ├── app/              # 앱 핵심 컴포넌트
│   │   ├── App.tsx       # 루트 컴포넌트
│   │   ├── Router.tsx    # 라우팅 설정
│   │   └── Layout.tsx    # 레이아웃
│   ├── components/       # 공통 컴포넌트
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Breadcrumb.tsx
│   │   └── LoadingSpinner.tsx
│   ├── lib/              # 유틸리티 라이브러리
│   │   ├── api-client.ts
│   │   └── utils.ts
│   ├── store/            # 전역 상태 관리
│   │   ├── auth.store.ts
│   │   └── app.store.ts
│   ├── types/            # 타입 정의
│   │   ├── common.ts
│   │   └── remote-modules.d.ts
│   ├── main.tsx          # 엔트리 포인트
│   └── index.css         # 글로벌 스타일
├── vite.config.ts        # Vite 설정
├── tsconfig.json         # TypeScript 설정
└── package.json
```

## 🔑 주요 기능

### 1. Module Federation

Vite Plugin Federation을 사용하여 Remote 앱을 동적으로 로드합니다.

```typescript
federation({
  name: 'shell',
  remotes: {
    systemMfe: 'http://localhost:3100/assets/remoteEntry.js',
    hrMfe: 'http://localhost:3101/assets/remoteEntry.js',
    // ...
  },
  shared: {
    react: { singleton: true },
    'react-dom': { singleton: true },
    // ...
  },
})
```

### 2. 전역 상태 관리

Zustand를 사용하여 인증 상태와 앱 상태를 관리합니다.

- `useAuthStore`: 사용자 인증 상태
- `useAppStore`: 앱 UI 상태 (사이드바, 로딩 등)

### 3. API 통신

Axios 인터셉터를 사용하여 JWT 토큰을 자동으로 추가하고 401 에러 시 자동 로그아웃 처리합니다.

### 4. 라우팅

React Router를 사용하여 각 Remote 앱의 라우트를 통합하고 관리합니다.

## 🐳 Docker

Shell 앱은 Docker 컨테이너로 실행할 수 있습니다.

```bash
# docker-compose.frontend.yml 참조
docker compose -f dev-environment/docker-compose.frontend.yml up shell
```

## 📝 주요 컴포넌트

### Header

- 사용자 정보 표시
- 알림 아이콘
- 로그아웃 버튼

### Sidebar

- 주요 메뉴 네비게이션
- 현재 활성 경로 표시

### Breadcrumb

- 현재 페이지 경로 표시
- 계층적 네비게이션

## 🔐 인증

Shell 앱은 auth-service와 통합되어 JWT 기반 인증을 제공합니다.

1. 로그인 시 JWT 토큰 발급
2. 토큰을 localStorage에 저장
3. 모든 API 요청에 토큰 자동 추가
4. 토큰 만료 시 자동 로그아웃

## 🌐 환경 변수

| 변수 | 설명 | 기본값 |
|------|------|--------|
| VITE_API_GATEWAY_URL | API Gateway URL | http://localhost:8080 |
| VITE_ENV | 환경 설정 | development |

## 📚 관련 문서

- [Micro Frontend 가이드](file:///data/all-erp/docs/architecture/micro-frontend-guide.md)
- [Phase 5 구현 계획](file:///data/all-erp/docs/tasks/v2-migration/phase5/)
