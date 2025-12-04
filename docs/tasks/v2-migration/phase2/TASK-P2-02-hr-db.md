# TASK-P2-02: HR 도메인 DB 연결

## 📋 작업 개요
- **Phase**: Phase 2 (서비스별 DB 연결 변경)
- **예상 시간**: 0.5주
- **우선순위**: High
- **선행 작업**: TASK-P2-01

## 🎯 목표

HR 도메인(personnel, payroll, attendance 서비스)의 DB 연결을 신규 독립 DB로 전환합니다.

## 📝 상세 작업 내용

### personnel-service 연결 (.env)
```bash
DATABASE_URL="postgresql://postgres:password@localhost:5435/personnel_db"
```

### payroll-service 연결 (.env)
```bash
DATABASE_URL="postgresql://postgres:password@localhost:5436/payroll_db"
```

### attendance-service 연결 (.env)
```bash
DATABASE_URL="postgresql://postgres:password@localhost:5437/attendance_db"
```

### 마이그레이션 및 테스트
```bash
cd apps/hr/personnel-service && pnpm prisma migrate deploy && pnpm prisma generate
cd ../payroll-service && pnpm prisma migrate deploy && pnpm prisma generate
cd ../attendance-service && pnpm prisma migrate deploy && pnpm prisma generate
```

## ✅ 완료 조건

- [ ] 3개 서비스 DB 연결 변경
- [ ] Prisma 마이그레이션 성공
- [ ] 서비스 정상 실행 확인
- [ ] API 테스트 성공

## 🔧 실행 명령어

```bash
pnpm nx serve personnel-service  # :3011
pnpm nx serve payroll-service    # :3012
pnpm nx serve attendance-service # :3013
```

## 🚨 주의사항

- 각 서비스의 포트가 충돌하지 않도록 확인
