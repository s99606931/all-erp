# Micro Frontend 개발 가이드

## 📋 개요

Module Federation 기반 Micro Frontend 개발을 위한 실전 가이드입니다.

---

## 1. 아키텍처 구조

```
apps/frontend/
├── shell/               # Host 앱 (4200)
├── system-mfe/          # Remote 앱 (4201) - 시스템관리
├── hr-mfe/              # Remote 앱 (4202) - 인사관리
├── payroll-mfe/         # Remote 앱 (4203) - 급여관리
├── attendance-mfe/      # Remote 앱 (4204) - 복무관리
├── budget-mfe/          # Remote 앱 (4205) - 예산회계
├── treasury-mfe/        # Remote 앱 (4206) - 재무회계
├── accounting-mfe/      # Remote 앱 (4207) - 회계결산
├── asset-mfe/           # Remote 앱 (4208) - 자산관리
├── inventory-mfe/       # Remote 앱 (4209) - 물품관리
└── general-affairs-mfe/ # Remote 앱 (4210) - 총무관리
```

---

## 2. Module Federation 설정

### Shell 앱 (Host)

```typescript
// apps/frontend/shell/webpack.config.ts
import { ModuleFederationPlugin } from '@module-federation/enhanced';

export default {
  plugins: [
    new ModuleFederationPlugin({
      name: 'shell',
      remotes: {
        systemMfe: 'systemMfe@http://localhost:4201/remoteEntry.js',
        hrMfe: 'hrMfe@http://localhost:4202/remoteEntry.js',
        payrollMfe: 'payrollMfe@http://localhost:4203/remoteEntry.js',
        // ... 10개
      },
      shared: {
        react: { 
          singleton: true, 
          requiredVersion: '^19.0.0',
          eager: true,
        },
        'react-dom': { singleton: true, eager: true },
        'react-router-dom': { singleton: true },
        '@tanstack/react-query': { singleton: true },
        'zustand': { singleton: true },
      },
    }),
  ],
};
```

### Remote 앱 (예: system-mfe)

```typescript
// apps/frontend/system-mfe/webpack.config.ts
import { ModuleFederationPlugin } from '@module-federation/enhanced';

export default {
  plugins: [
    new ModuleFederationPlugin({
      name: 'systemMfe',
      filename: 'remoteEntry.js',
      exposes: {
        './Routes': './src/routes/index.tsx',
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
      },
    }),
  ],
};
```

---

## 3. Shell 앱 구현

```typescript
// apps/frontend/shell/src/App.tsx
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';

// Remote 앱 동적 로딩
const SystemRoutes = lazy(() => import('systemMfe/Routes'));
const HrRoutes = lazy(() => import('hrMfe/Routes'));
const PayrollRoutes = lazy(() => import('payrollMfe/Routes'));

export function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/system/*" element={<SystemRoutes />} />
            <Route path="/hr/*" element={<HrRoutes />} />
            <Route path="/payroll/*" element={<PayrollRoutes />} />
            {/* ... */}
          </Routes>
        </Suspense>
      </AppLayout>
    </BrowserRouter>
  );
}
```

---

## 4. Remote 앱 구현

```typescript
// apps/frontend/system-mfe/src/routes/index.tsx
import { Routes, Route } from 'react-router-dom';
import { CommonCodePage } from '../pages/CommonCodePage';
import { DepartmentPage } from '../pages/DepartmentPage';

export default function SystemRoutes() {
  return (
    <Routes>
      <Route path="/common-code" element={<CommonCodePage />} />
      <Route path="/department" element={<DepartmentPage />} />
      {/* ... 69개 페이지 */}
    </Routes>
  );
}
```

---

## 5. 공통 라이브러리

```
libs/frontend/
├── shared/
│   ├── ui/              # Shadcn UI 컴포넌트
│   ├── forms/           # 공통 폼 컴포넌트
│   ├── tables/          # DataTable 등
│   └── utils/           # 유틸리티
├── stores/
│   ├── authStore.ts     # 인증 상태 (공유)
│   └── uiStore.ts       # UI 상태
└── api/
    ├── client.ts        # Axios 인스턴스
    └── types.ts         # 공통 타입
```

---

## 6. 상태 관리

### Shell에서 관리 (공유 상태)

```typescript
// libs/frontend/stores/authStore.ts
import create from 'zustand';

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  login: async (credentials) => {
    const { token, user } = await authApi.login(credentials);
    set({ token, user });
  },
  logout: () => set({ token: null, user: null }),
}));
```

### Remote에서 사용

```typescript
// system-mfe에서 사용
import { useAuthStore } from '@all-erp/frontend-stores';

export function CommonCodePage() {
  const user = useAuthStore((state) => state.user);
  // ...
}
```

---

## 7. 개발 워크플로우

### 독립 개발

```bash
# Remote 앱만 실행 (독립 개발)
cd apps/frontend/system-mfe
pnpm dev

# http://localhost:4201에서 확인
```

### 통합 개발

```bash
# Shell + Remote 동시 실행
pnpm concurrently \
  "pnpm nx serve shell" \
  "pnpm nx serve system-mfe" \
  "pnpm nx serve hr-mfe"
```

---

## 8. 배포 전략

### 독립 배포

```bash
# Remote 앱 독립 배포
pnpm nx build system-mfe
# → dist/apps/frontend/system-mfe

# CDN에 업로드
aws s3 sync dist/apps/frontend/system-mfe s3://cdn/system-mfe

# Shell 앱은 재배포 불필요!
```

---

## 9. 개발 체크리스트

### Remote 앱 생성 시

- [ ] Nx 앱 스캐폴딩
- [ ] Module Federation 설정
- [ ] Routes 컴포넌트 export
- [ ] Shell 앱에 remote 등록
- [ ] 독립 실행 확인

---

## 10. 참조 문서

- [Module Federation 공식 문서](https://module-federation.github.io/)
- [마이크로서비스 전환 계획 v2.0](/docs/README-MICROSERVICES-PLAN.md)
