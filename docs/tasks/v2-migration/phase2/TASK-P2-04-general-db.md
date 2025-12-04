# TASK-P2-04: General 도메인 DB 연결

## 📋 작업 개요
- **Phase**: Phase 2
- **예상 시간**: 0.5주
- **우선순위**: High
- **선행 작업**: TASK-P2-03

## 🎯 목표

General 도메인(asset, supply, general-affairs 서비스) + AI 서비스의 DB 연결을 전환합니다.

## 📝 상세 작업 내용

### asset-service (.env)
```bash
DATABASE_URL="postgresql://postgres:devpassword123@localhost:5432/asset_db"
```

### supply-service (.env)
```bash
DATABASE_URL="postgresql://postgres:devpassword123@localhost:5432/supply_db"
```

### general-affairs-service (.env)
```bash
DATABASE_URL="postgresql://postgres:devpassword123@localhost:5432/general_affairs_db"
```

### ai-service (.env - MongoDB)
```bash
DATABASE_URL="mongodb://mongo:devpassword123@localhost:27017/ai_db"
```

### 마이그레이션
```bash
cd apps/general/asset-service && pnpm prisma migrate dev --name init && pnpm prisma generate
cd ../supply-service && pnpm prisma migrate dev --name init && pnpm prisma generate
cd ../general-affairs-service && pnpm prisma migrate dev --name init && pnpm prisma generate
```

## ✅ 완료 조건

- [ ] 4개 서비스 DB 연결
- [ ] 마이그레이션 성공
- [ ] AI 서비스 MongoDB 연결 확인

## 🔧 실행 명령어

```bash
pnpm nx serve asset-service          # :3031
pnpm nx serve supply-service         # :3032
pnpm nx serve general-affairs-service # :3033
pnpm nx serve ai-service             # :3007
```
