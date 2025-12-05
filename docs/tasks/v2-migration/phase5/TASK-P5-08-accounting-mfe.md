# TASK-P5-08: accounting MFE

## 📋 작업 개요
- **Phase**: Phase 5
- **예상 시간**: 1주
- **우선순위**: Medium
- **선행 작업**: TASK-P5-

## 🎯 목표

accounting-mfe  Remote 앱 개발 (61 페이지).

## 📝 상세 작업 내용

### vite.config.ts

```typescript
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'accountingmfe',
      filename: 'remoteEntry.js',
      exposes: { './routes': './src/routes.tsx' },
      shared: { react: { singleton: true }, 'react-dom': { singleton: true } },
    }),
  ],
  server: { port: 3106 },
});
```

## ✅ 완료 조건

- [x] Vite 앱 생성
- [x] Module Federation 설정
- [x] 61개 페이지 구현  - erp메뉴구조참고 
- [ ] Shell 앱 연동

## 🔧 실행 명령어

```bash
pnpm dev  # :3106
```
