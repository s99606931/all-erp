-- =====================================================
-- Notification Service 초기 마이그레이션
-- 사용자 알림 처리를 위한 테이블 생성
-- =====================================================

-- 알림 테이블 생성
-- 사용자별 알림 발송 및 읽음 상태 관리
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL, -- 수신자 ID
    "type" TEXT NOT NULL, -- 알림 유형 (EMAIL, SMS, PUSH, IN_APP)
    "title" TEXT NOT NULL, -- 제목
    "message" TEXT NOT NULL, -- 내용
    "is_read" BOOLEAN NOT NULL DEFAULT false, -- 읽음 여부
    "read_at" TIMESTAMP(3), -- 읽은 시간
    "tenant_id" TEXT NOT NULL, -- 테넌트 ID
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
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
-- 테넌트별 알림 조회
CREATE INDEX "notifications_tenant_id_idx" ON "notifications" ("tenant_id");

-- 사용자별 알림 조회 (내 알림)
CREATE INDEX "notifications_user_id_idx" ON "notifications" ("user_id");

-- 읽음 상태별 조회 (안 읽은 알림 필터링)
CREATE INDEX "notifications_is_read_idx" ON "notifications" ("is_read");

CREATE UNIQUE INDEX "outbox_events_event_id_key" ON "outbox_events" ("event_id");
