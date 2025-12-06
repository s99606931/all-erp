# TASK-P4-02: Report Service 개발

## 📋 작업 개요
- **Phase**: Phase 4 (신규 서비스 개발)
- **예상 시간**: 1주
- **우선순위**: High
- **선행 작업**: TASK-P4-01

## 🎯 목표

보고서 생성 및 관리 마이크로서비스를 개발합니다.

## 📝 상세 작업 내용

### Prisma 스키마 (report_db)

```prisma
model Report {
  id          Int      @id @default(autoincrement())
  title       String
  reportType  String   @map("report_type")  // PERSONNEL, PAYROLL, BUDGET, etc.
  format      String   // PDF, EXCEL, CSV
  status      String   // PENDING, PROCESSING, COMPLETED, FAILED
  generatedBy Int      @map("generated_by")
  fileUrl     String?  @map("file_url")
  tenantId    Int      @map("tenant_id")
  createdAt   DateTime @default(now()) @map("created_at")

  @@map("reports")
}

model ReportTemplate {
  id          Int      @id @default(autoincrement())
  name        String
  description String?
  templateData String  @map("template_data")  // JSON
  tenantId    Int      @map("tenant_id")
  createdAt   DateTime @default(now()) @map("created_at")

  @@map("report_templates")
}
```

### 핵심 API

- POST /api/v1/reports (보고서 생성 요청)
- GET /api/v1/reports (보고서 목록)
- GET /api/v1/reports/:id (보고서 상세)
- GET /api/v1/reports/:id/download (보고서 다운로드)
- POST /api/v1/report-templates (템플릿 생성)

## ✅ 완료 조건

- [ ] report-service 앱 생성
- [ ] Prisma 스키마 및 마이그레이션
- [ ] CRUD API 구현
- [ ] PDF/Excel 생성 기능
- [ ] 이벤트 발행 (report.generated)
- [ ] Swagger 문서화
- [ ] 단위 테스트

## 🔧 실행 명령어

```bash
pnpm nx serve report-service  # :3042
```
