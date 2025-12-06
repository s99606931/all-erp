# v2.0 마이크로서비스 마이그레이션 Task 목록

> **기간**: 26주 (Phase 1~6)  
> **목표**: Database per Service + Micro Frontend 전환

## Task 실행 순서

각 Phase는 순차적으로 진행되며, Phase 내의 task들은 병렬 또는 순차 실행 가능합니다.

### Phase 1: Database 분리 (4주)
1. [TASK-P1-01: DB 인스턴스 생성 및 스키마 설계](./phase1/TASK-P1-01-db-instances.md)
2. [TASK-P1-02: Prisma 스키마 분리](./phase1/TASK-P1-02-prisma-schemas.md)
3. [TASK-P1-03: 데이터 마이그레이션 스크립트](./phase1/TASK-P1-03-data-migration.md)
4. [TASK-P1-04: Docker Compose 인프라 설정](./phase1/TASK-P1-04-docker-infra.md)

### Phase 2: 서비스별 DB 연결 변경 (2주)
1. [TASK-P2-01: System 도메인 DB 연결](./phase2/TASK-P2-01-system-db.md)
2. [TASK-P2-02: HR 도메인 DB 연결](./phase2/TASK-P2-02-hr-db.md)
3. [TASK-P2-03: Finance 도메인 DB 연결](./phase2/TASK-P2-03-finance-db.md)
4. [TASK-P2-04: General 도메인 DB 연결](./phase2/TASK-P2-04-general-db.md)

### Phase 3: 서비스 간 통신 구현 (4주)
1. [TASK-P3-01: RabbitMQ 설정 및 공통 모듈](./phase3/TASK-P3-01-rabbitmq-setup.md)
2. [TASK-P3-02: 이벤트 스키마 정의](./phase3/TASK-P3-02-event-schemas.md)
3. [TASK-P3-03: HTTP API 통신 구현](./phase3/TASK-P3-03-api-communication.md)
4. [TASK-P3-04: 이벤트 기반 통신 구현](./phase3/TASK-P3-04-event-communication.md)

### Phase 4: 신규 서비스 개발 (4주)
1. [TASK-P4-01: Approval Service 개발](./phase4/TASK-P4-01-approval-service.md)
2. [TASK-P4-02: Report Service 개발](./phase4/TASK-P4-02-report-service.md)
3. [TASK-P4-03: Notification Service 개발](./phase4/TASK-P4-03-notification-service.md)
4. [TASK-P4-04: File Service 개발](./phase4/TASK-P4-04-file-service.md)

### Phase 5: Micro Frontend 구현 (8주)
1. [TASK-P5-01: Shell 앱 기본 구조](./phase5/TASK-P5-01-shell-app.md)
2. [TASK-P5-02: System MFE](./phase5/TASK-P5-02-system-mfe.md)
3. [TASK-P5-03: HR MFE](./phase5/TASK-P5-03-hr-mfe.md)
4. [TASK-P5-04: Payroll MFE](./phase5/TASK-P5-04-payroll-mfe.md)
5. [TASK-P5-05: Attendance MFE](./phase5/TASK-P5-05-attendance-mfe.md)
6. [TASK-P5-06: Budget MFE](./phase5/TASK-P5-06-budget-mfe.md)
7. [TASK-P5-07: Treasury MFE](./phase5/TASK-P5-07-treasury-mfe.md)
8. [TASK-P5-08: Accounting MFE](./phase5/TASK-P5-08-accounting-mfe.md)
9. [TASK-P5-09: Asset MFE](./phase5/TASK-P5-09-asset-mfe.md)
10. [TASK-P5-10: Inventory MFE](./phase5/TASK-P5-10-inventory-mfe.md)
11. [TASK-P5-11: General Affairs MFE](./phase5/TASK-P5-11-general-affairs-mfe.md)

### Phase 6: 통합 테스트 및 최적화 (4주)
1. [TASK-P6-01: E2E 테스트](./phase6/TASK-P6-01-e2e-tests.md)
2. [TASK-P6-02: 성능 최적화](./phase6/TASK-P6-02-performance.md)
3. [TASK-P6-03: 모니터링 설정](./phase6/TASK-P6-03-monitoring.md)
4. [TASK-P6-04: 배포 자동화](./phase6/TASK-P6-04-deployment.md)

---

## Task 문서 규격

각 task 문서는 다음 형식을 따릅니다:

```markdown
# TASK-{Phase}-{번호}: {작업명}

## 📋 작업 개요
- **Phase**: {Phase 번호}
- **예상 시간**: {시간}
- **우선순위**: High/Medium/Low
- **선행 작업**: {의존성}

## 🎯 목표
{구체적인 달성 목표}

## 📝 상세 작업 내용
{AI가 실행할 구체적인 작업 단계}

## ✅ 완료 조건
- [ ] {조건 1}
- [ ] {조건 2}

## 📚 참고 문서
{관련 문서 링크}
```

---

## 진행 상황 추적

| Phase | 완료 Task | 전체 Task | 진행률 |
|-------|-----------|-----------|--------|
| Phase 1 | 0 | 4 | 0% |
| Phase 2 | 0 | 4 | 0% |
| Phase 3 | 0 | 4 | 0% |
| Phase 4 | 0 | 4 | 0% |
| Phase 5 | 0 | 11 | 0% |
| Phase 6 | 0 | 4 | 0% |
| **전체** | **0** | **31** | **0%** |
