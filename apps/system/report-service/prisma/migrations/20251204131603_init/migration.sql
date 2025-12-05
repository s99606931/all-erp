-- =====================================================
-- Report Service 초기 마이그레이션
-- 보고서 생성 및 조회를 위한 테이블 생성
-- =====================================================

-- 보고서 테이블 생성 (CQRS Read Model)
-- 미리 계산된 보고서 데이터를 JSON 형태로 저장하여 조회 성능 최적화
CREATE TABLE "reports" (
    "id" TEXT NOT NULL,
    "report_type" TEXT NOT NULL, -- 보고서 유형 (PAYROLL, ATTENDANCE, BUDGET 등)
    "month" TEXT NOT NULL, -- 대상 월 (YYYY-MM 형식)
    "data" TEXT NOT NULL, -- 보고서 데이터 (JSON 문자열)
    "tenant_id" TEXT NOT NULL, -- 테넌트 ID
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- 처리된 이벤트 테이블 생성
-- 중복 이벤트 처리 방지를 위한 이벤트 추적
CREATE TABLE "processed_events" (
    "event_id" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "processed_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "processed_events_pkey" PRIMARY KEY ("event_id")
);

-- Outbox 이벤트 테이블 생성
-- 트랜잭셔널 아웃박스 패턴을 위한 이벤트 저장소
CREATE TABLE "outbox_events" (
    "id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "payload" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "outbox_events_pkey" PRIMARY KEY ("id")
);

-- 인덱스 생성
-- 테넌트별 보고서 조회
CREATE INDEX "reports_tenant_id_idx" ON "reports" ("tenant_id");

-- 보고서 유형별 조회
CREATE INDEX "reports_report_type_idx" ON "reports" ("report_type");

-- 테넌트, 유형, 월 조합의 고유성 보장 (중복 생성 방지)
CREATE UNIQUE INDEX "reports_tenant_id_report_type_month_key" ON "reports" (
    "tenant_id",
    "report_type",
    "month"
);

CREATE UNIQUE INDEX "outbox_events_event_id_key" ON "outbox_events" ("event_id");
