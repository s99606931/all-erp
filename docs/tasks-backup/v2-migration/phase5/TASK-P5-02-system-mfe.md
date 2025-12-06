# TASK-P5-02: System MFE

## 📋 작업 개요
- **Phase**: Phase 5 (Micro Frontend 구현)
- **예상 시간**: 0.5주
- **우선순위**: Medium
- **선행 작업**: TASK-P5-01

## 🎯 목표

시스템 관리 Remote 앱 개발 (69 페이지).

## 📝 상세 작업 내용

### vite.config.ts (Module Federation)

```typescript
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'systemMfe',
      filename: 'remoteEntry.js',
      exposes: {
        './routes': './src/routes.tsx',
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
        'react-router-dom': { singleton: true },
      },
    }),
  ],
  server: { port: 3100 },
});
```

### 라우트 export

```typescript
// src/routes.tsx
import { Routes, Route } from 'react-router-dom';

export default function SystemRoutes() {
  return (
    <Routes>
      <Route path="users" element={<UserList />} />
      <Route path="users/:id" element={<UserDetail />} />
      <Route path="roles" element={<RoleList />} />
      {/* 69개 페이지 라우트 */}
    </Routes>
  );
}
```

## ✅ 완료 조건

- [ ] Vite 앱 생성
- [ ] Module Federation 설정
- [ ] 백앤드 DB 구조를 확인후 페이지 기본 생성 
- [ ] Shell 앱에서 로드 확인

## 🔧 실행 명령어

```bash
cd apps/frontend/remote/system-mfe
pnpm dev  # :3100
```
