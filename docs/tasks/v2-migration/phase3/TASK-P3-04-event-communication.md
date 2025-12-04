# TASK-P3-04: 이벤트 기반 통신 구현

## 📋 작업 개요
- **Phase**: Phase 3
- **예상 시간**: 1주
- **우선순위**: High
- **선행 작업**: TASK-P3-03

## 🎯 목표

RabbitMQ 기반 이벤트 발행/구독 패턴을 모든 서비스에 적용합니다.

## 📝 상세 작업 내용

### 1. 주요 이벤트 flow 구현

**직원 생성 → 급여 캐시**:
```typescript
// personnel-service: 발행
await this.eventEmitter.emit('employee.created', {
  tenantId: employee.tenantId,
  data: { employeeId: employee.id, name: employee.name },
});

// payroll-service: 수신
@EventPattern('employee.created')
async handleEmployeeCreated(event: EmployeeCreatedEvent) {
  await this.prisma.employeeCache.create({ data: event.data });
}
```

## ✅ 완료 조건

- [ ] 모든 서비스에 이벤트 모듈 통합
- [ ] 주요 이벤트 flow 10개 이상 구현
- [ ] 멱등성 보장 구현
- [ ] Transactional Outbox 패턴 적용
- [ ] 통합 테스트 성공

## 🔧 실행 명령어

```bash
# RabbitMQ Management UI
open http://localhost:15672

# 이벤트 flow 테스트
pnpm test:e2e
```
