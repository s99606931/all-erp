# TASK-P5-01: Shell 앱 기본 구조

## 📋 작업 개요
- **Phase**: Phase 5 (Micro Frontend 구현)
- **예상 시간**: 1주
- **우선순위**: High
- **선행 작업**: TASK-P4-04 (모든 신규 서비스 개발 완료)

## 🎯 목표

Micro Frontend의 Host 역할을 하는 Shell 앱을 구축하고, Remote 앱을 동적으로 로드할 수 있는 기반을 마련합니다.

## 📝 상세 작업 내용

### 1. Vite + React 프로젝트 생성

```bash
cd apps/frontend
pnpm create vite shell --template react-ts
cd shell
pnpm install
```

### 2. Module Federation 설정

**vite.config.ts**:
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'shell',
      remotes: {
        systemMfe: 'http://localhost:3100/assets/remoteEntry.js',
        hrMfe: 'http://localhost:3101/assets/remoteEntry.js',
        payrollMfe: 'http://localhost:3102/assets/remoteEntry.js',
        attendanceMfe: 'http://localhost:3103/assets/remoteEntry.js',
        budgetMfe: 'http://localhost:3104/assets/remoteEntry.js',
        treasuryMfe: 'http://localhost:3105/assets/remoteEntry.js',
        accountingMfe: 'http://localhost:3106/assets/remoteEntry.js',
        assetMfe: 'http://localhost:3107/assets/remoteEntry.js',
        inventoryMfe: 'http://localhost:3108/assets/remoteEntry.js',
        generalAffairsMfe: 'http://localhost:3109/assets/remoteEntry.js',
      },
      shared: {
        react: { singleton: true, requiredVersion: '^18.0.0' },
        'react-dom': { singleton: true, requiredVersion: '^18.0.0' },
        'react-router-dom': { singleton: true },
        '@tanstack/react-query': { singleton: true },
        zustand: { singleton: true },
      },
    }),
  ],
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
  server: {
    port: 3000,
    strictPort: true,
  },
});
```

### 3. 폴더 구조

```
apps/frontend/shell/
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   ├── Router.tsx
│   │   └── Layout.tsx
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Footer.tsx
│   │   └── Breadcrumb.tsx
│   ├── lib/
│   │   ├── api-client.ts
│   │   ├── auth.ts
│   │   └── utils.ts
│   ├── store/
│   │   ├── auth.store.ts
│   │   └── app.store.ts
│   ├── types/
│   │   └── remote-modules.d.ts
│   └── main.tsx
├── vite.config.ts
└── package.json
```

### 4. Remote 모듈 타입 정의

**types/remote-modules.d.ts**:
```typescript
declare module 'systemMfe/routes' {
  const routes: any;
  export default routes;
}

declare module 'hrMfe/routes' {
  const routes: any;
  export default routes;
}

declare module 'payrollMfe/routes' {
  const routes: any;
  export default routes;
}

// ... 나머지 Remote 앱도 동일하게 정의
```

### 5. 라우팅 설정

**Router.tsx**:
```typescript
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Layout';
import LoadingSpinner from '../components/LoadingSpinner';

// Remote 앱 동적 로드
const SystemRoutes = lazy(() => import('systemMfe/routes'));
const HrRoutes = lazy(() => import('hrMfe/routes'));
const PayrollRoutes = lazy(() => import('payrollMfe/routes'));
const AttendanceRoutes = lazy(() => import('attendanceMfe/routes'));
const BudgetRoutes = lazy(() => import('budgetMfe/routes'));
const TreasuryRoutes = lazy(() => import('treasuryMfe/routes'));
const AccountingRoutes = lazy(() => import('accountingMfe/routes'));
const AssetRoutes = lazy(() => import('assetMfe/routes'));
const InventoryRoutes = lazy(() => import('inventoryMfe/routes'));
const GeneralAffairsRoutes = lazy(() => import('generalAffairsMfe/routes'));

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          
          <Route path="/dashboard" element={<div>Dashboard</div>} />

          {/* Remote 앱 라우트 */}
          <Route
            path="/system/*"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <SystemRoutes />
              </Suspense>
            }
          />

          <Route
            path="/hr/*"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <HrRoutes />
              </Suspense>
            }
          />

          <Route
            path="/payroll/*"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <PayrollRoutes />
              </Suspense>
            }
          />

          {/* ... 나머지 Remote 앱 라우트 */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

### 6. 공통 레이아웃

**Layout.tsx**:
```typescript
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Breadcrumb from '../components/Breadcrumb';

export default function Layout() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <Breadcrumb />
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
```

### 7. 전역 상태 관리

**store/auth.store.ts** (Zustand):
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email, password) => {
        const response = await fetch('http://localhost:3001/api/v1/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        set({
          user: data.user,
          token: data.token,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    { name: 'auth-storage' }
  )
);
```

### 8. API 클라이언트

**lib/api-client.ts**:
```typescript
import axios from 'axios';
import { useAuthStore } from '../store/auth.store';

const apiClient = axios.create({
  baseURL: process.env.VITE_API_GATEWAY_URL || 'http://localhost:8080',
  timeout: 10000,
});

// 요청 인터셉터: 토큰 자동 추가
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터: 에러 처리
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

## ✅ 완료 조건

- [ ] Shell 앱 Vite 프로젝트 생성
- [ ] Module Federation 플러그인 설정
- [ ] 10개 Remote 앱 연결 설정
- [ ] 라우팅 구조 구현
- [ ] 공통 레이아웃 (Header, Sidebar) 구현
- [ ] 전역 상태 관리 (Zustand) 설정
- [ ] API 클라이언트 구현
- [ ] 로컬 실행 성공 (`http://localhost:3000`)

## 🔧 실행 명령어

```bash
cd apps/frontend/shell
pnpm dev

# 브라우저에서 확인
open http://localhost:3000
```

## 📚 참고 문서

- [Micro Frontend 가이드](file:///data/all-erp/docs/architecture/micro-frontend-guide.md)
- [Module Federation 공식 문서](https://module-federation.github.io/)

## 🚨 주의사항

- 모든 Remote 앱은 독립적으로 실행 가능해야 함
- Shared 라이브러리는 singleton으로 설정
- 각 Remote 앱의 포트는 3100번대 사용
- 개발 환경에서는 CORS 설정 필요
