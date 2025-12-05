-- =====================================================
-- Approval Service 초기 마이그레이션
-- 전자결재 시스템을 위한 테이블 생성
-- =====================================================

-- 결재 요청 테이블 생성
-- 기안서 정보와 현재 상태 관리
CREATE TABLE "approval_requests" (
    "id" TEXT NOT NULL,
    "request_type" TEXT NOT NULL, -- 결재 유형 (휴가, 지출결의, 품의 등)
    "requester_id" TEXT NOT NULL, -- 기안자 ID
    "title" TEXT NOT NULL, -- 결재 제목
    "content" TEXT NOT NULL, -- 결재 내용 (JSON 또는 HTML)
    "status" TEXT NOT NULL DEFAULT 'PENDING', -- 상태 (PENDING, APPROVED, REJECTED)
    "tenant_id" TEXT NOT NULL, -- 테넌트 ID
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "approval_requests_pkey" PRIMARY KEY ("id")
);

-- 결재 라인 테이블 생성
-- 결재/합의/참조자 목록 및 순서 관리
CREATE TABLE "approval_lines" (
    "id" TEXT NOT NULL,
    "request_id" TEXT NOT NULL, -- 결재 요청 ID (외래키)
    "approver_id" TEXT NOT NULL, -- 결재자 ID
    "order" INTEGER NOT NULL, -- 결재 순서 (1, 2, 3...)
    "status" TEXT NOT NULL DEFAULT 'PENDING', -- 결재 상태 (PENDING, APPROVED, REJECTED)
    "comment" TEXT, -- 결재 의견
    "decided_at" TIMESTAMP(3), -- 결재 처리 일시
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "approval_lines_pkey" PRIMARY KEY ("id")
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
-- 테넌트별 결재 요청 조회
CREATE INDEX "approval_requests_tenant_id_idx" ON "approval_requests" ("tenant_id");

-- 기안자별 결재 요청 조회 (내 문서함)
CREATE INDEX "approval_requests_requester_id_idx" ON "approval_requests" ("requester_id");

-- 상태별 결재 요청 조회 (진행/완료/반려)
CREATE INDEX "approval_requests_status_idx" ON "approval_requests" ("status");

-- 결재 요청별 결재 라인 조회
CREATE INDEX "approval_lines_request_id_idx" ON "approval_lines" ("request_id");

-- 결재자별 대기 문서 조회 (결재 대기함)
CREATE INDEX "approval_lines_approver_id_idx" ON "approval_lines" ("approver_id");

CREATE UNIQUE INDEX "outbox_events_event_id_key" ON "outbox_events" ("event_id");

-- 외래키 제약조건 추가
ALTER TABLE "approval_lines"
ADD CONSTRAINT "approval_lines_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "approval_requests" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
