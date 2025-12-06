# TASK-P2-05: Platform 도메인 DB 연결

## 📋 작업 개요
- **Phase**: Phase 2
- **예상 시간**: 0.5주
- **우선순위**: High
- **선행 작업**: TASK-P2-04

## 🎯 목표

Platform 도메인(approval, report, notification, file 서비스)의 DB 연결을 분리하여 Database per Service 패턴을 완성합니다. (실제 서비스 경로는 `apps/system` 하위에 위치함)

## 📝 상세 작업 내용

### approval-service (.env)
```bash
DATABASE_URL="postgresql://postgres:devpassword123@localhost:5432/approval_db"
```

### report-service (.env)
```bash
DATABASE_URL="postgresql://postgres:devpassword123@localhost:5432/report_db"
```

### notification-service (.env)
```bash
DATABASE_URL="postgresql://postgres:devpassword123@localhost:5432/notification_db"
```

### file-service (.env)
```bash
DATABASE_URL="postgresql://postgres:devpassword123@localhost:5432/file_db"
```

### 마이그레이션

각 서비스 폴더에는 `prisma` 디렉토리가 존재하므로, `prisma.config.ts`를 생성하고 마이그레이션을 진행합니다.

1. **Prisma Config 생성**
   각 서비스별로 `prisma.config.ts` 파일 생성 (Prisma 7 호환)

2. **Schema 수정**
   `schema.prisma` 파일에서 `datasource.url` 제거

3. **마이그레이션 실행**
   ```bash
   # approval-service
   cd apps/system/approval-service
   pnpm prisma migrate dev --name init --config=prisma.config.ts
   pnpm prisma generate --config=prisma.config.ts

   # report-service
   cd apps/system/report-service
   pnpm prisma migrate dev --name init --config=prisma.config.ts
   pnpm prisma generate --config=prisma.config.ts

   # notification-service
   cd apps/system/notification-service
   pnpm prisma migrate dev --name init --config=prisma.config.ts
   pnpm prisma generate --config=prisma.config.ts

   # file-service
   cd apps/system/file-service
   pnpm prisma migrate dev --name init --config=prisma.config.ts
   pnpm prisma generate --config=prisma.config.ts
   ```

## ✅ 완료 조건

- [ ] 4개 서비스(approval, report, notification, file) DB 연결 분리
- [ ] 각 서비스별 `prisma.config.ts` 생성
- [ ] 마이그레이션 성공 (각 DB에 테이블 생성 확인)
- [ ] 마이그레이션 SQL 파일에 한국어 주석 추가

## 🔧 실행 명령어 (참고)

애플리케이션 코드가 아직 완전히 구현되지 않았을 수 있으므로(빈 프로젝트), DB 마이그레이션에 집중합니다.

```bash
# 서비스 실행 (코드 존재 시)
pnpm nx serve approval-service
pnpm nx serve report-service
pnpm nx serve notification-service
pnpm nx serve file-service
```
