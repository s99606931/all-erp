# TASK-P5-05: attendance MFE

## 📋 작업 개요
- **Phase**: Phase 5
- **예상 시간**: 1주
- **우선순위**: Medium
- **선행 작업**: TASK-P5-04

## 🎯 목표

attendance-mfe  Remote 앱 개발 (92 페이지).

## 📝 상세 작업 내용

### vite.config.ts

```typescript
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'attendancemfe',
      filename: 'remoteEntry.js',
      exposes: { './routes': './src/routes.tsx' },
      shared: { react: { singleton: true }, 'react-dom': { singleton: true } },
    }),
  ],
  server: { port: 3103 },
});
```

## ✅ 완료 조건

- [ ] Vite 앱 생성
- [ ] Module Federation 설정
- [ ] 92개 페이지 구현
- [ ] Shell 앱 연동

## 🔧 실행 명령어

```bash
pnpm dev  # :3103
```
