# TASK-P4-03: Notification Service 개발

## 📋 작업 개요
- **Phase**: Phase 4
- **예상 시간**: 1주
- **우선순위**: High
- **선행 작업**: TASK-P4-02

## 🎯 목표

알림(Email, SMS, Push) 관리 마이크로서비스를 개발합니다.

## 📝 상세 작업 내용

### Prisma 스키마 (notification_db)

```prisma
model Notification {
  id          Int      @id @default(autoincrement())
  recipientId Int      @map("recipient_id")
  type        String   // EMAIL, SMS, PUSH
  title       String
  content     String
  status      String   // PENDING, SENT, FAILED
  sentAt      DateTime? @map("sent_at")
  tenantId    Int      @map("tenant_id")
  createdAt   DateTime @default(now()) @map("created_at")

  @@map("notifications")
}
```

### 핵심 API

- POST /api/v1/notifications (알림 발송)
- GET /api/v1/notifications (알림 목록)
- PATCH /api/v1/notifications/:id/read (읽음 처리)

### 이벤트 수신

```typescript
@EventPattern('approval.approved')
async handleApprovalApproved(event) {
  await this.sendNotification({
    recipientId: event.data.requesterId,
    type: 'EMAIL',
    title: '결재 승인',
    content: '결재가 승인되었습니다.',
  });
}
```

## ✅ 완료 조건

- [ ] notification-service 앱 생성
- [ ] 이메일 발송 기능 (NodeMailer)
- [ ] 이벤트 기반 알림 발송
- [ ] Swagger 문서화

## 🔧 실행 명령어

```bash
pnpm nx serve notification-service  # :3043
```
