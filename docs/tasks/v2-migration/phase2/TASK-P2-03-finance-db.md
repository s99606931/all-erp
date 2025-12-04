# TASK-P2-03: Finance 도메인 DB 연결

## 📋 작업 개요
- **Phase**: Phase 2
- **예상 시간**: 0.5주
- **우선순위**: High
- **선행 작업**: TASK-P2-02

## 🎯 목표

Finance 도메인(budget, accounting, settlement 서비스)의 DB 연결을 전환합니다.

## 📝 상세 작업 내용

### budget-service (.env)
```bash
DATABASE_URL="postgresql://postgres:password@localhost:5438/budget_db"
```

### accounting-service (.env)
```bash
DATABASE_URL="postgresql://postgres:password@localhost:5439/accounting_db"
```

### settlement-service (.env)
```bash
DATABASE_URL="postgresql://postgres:password@localhost:5440/settlement_db"
```

### 마이그레이션
```bash
cd apps/finance/budget-service && pnpm prisma migrate deploy
cd ../accounting-service && pnpm prisma migrate deploy
cd ../settlement-service && pnpm prisma migrate deploy
```

## ✅ 완료 조건

- [ ] 3개 서비스 DB 연결
- [ ] 마이그레이션 성공
- [ ] 서비스 실행 확인

## 🔧 실행 명령어

```bash
pnpm nx serve budget-service      # :3021
pnpm nx serve accounting-service  # :3022
pnpm nx serve settlement-service  # :3023
```
