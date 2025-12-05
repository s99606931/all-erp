-- =====================================================
-- Asset Service 초기 마이그레이션
-- 자산 관리를 위한 테이블 생성
-- =====================================================

-- 자산 테이블 생성
-- 회사의 고정자산 및 유동자산 정보를 관리
CREATE TABLE "assets" (
    "id" TEXT NOT NULL,
    "asset_number" TEXT NOT NULL, -- 자산 번호 (고유 식별자)
    "name" TEXT NOT NULL, -- 자산명
    "category" TEXT NOT NULL, -- 자산 분류 (예: 건물, 차량, 장비 등)
    "acquisition_date" DATE NOT NULL, -- 취득일
    "acquisition_value" DECIMAL(15, 2) NOT NULL, -- 취득가액
    "current_value" DECIMAL(15, 2) NOT NULL, -- 현재가액
    "status" TEXT NOT NULL DEFAULT 'ACTIVE', -- 상태 (ACTIVE: 사용중, TRANSFERRED: 이관, DISPOSED: 폐기)
    "tenant_id" TEXT NOT NULL, -- 테넌트 ID (멀티테넌시)
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "assets_pkey" PRIMARY KEY ("id")
);

-- 자산 이력 테이블 생성
-- 자산의 변경 이력을 추적 (취득, 이관, 감가상각, 폐기 등)
CREATE TABLE "asset_history" (
    "id" TEXT NOT NULL,
    "asset_id" TEXT NOT NULL, -- 자산 ID (외래키)
    "change_type" TEXT NOT NULL, -- 변경 유형 (ACQUIRED: 취득, TRANSFERRED: 이관, DEPRECIATED: 감가상각, DISPOSED: 폐기)
    "description" TEXT NOT NULL, -- 변경 설명
    "changed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, -- 변경 일시
    CONSTRAINT "asset_history_pkey" PRIMARY KEY ("id")
);

-- 처리된 이벤트 테이블 생성
-- 중복 이벤트 처리 방지를 위한 이벤트 추적
CREATE TABLE "processed_events" (
    "event_id" TEXT NOT NULL, -- 이벤트 ID (고유 식별자)
    "event_type" TEXT NOT NULL, -- 이벤트 타입
    "processed_at" TIMESTAMP(3) NOT NULL, -- 처리 일시
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "processed_events_pkey" PRIMARY KEY ("event_id")
);

-- Outbox 이벤트 테이블 생성
-- 트랜잭셔널 아웃박스 패턴을 위한 이벤트 저장소
CREATE TABLE "outbox_events" (
    "id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL, -- 이벤트 ID (고유 식별자)
    "event_type" TEXT NOT NULL, -- 이벤트 타입
    "payload" TEXT NOT NULL, -- 이벤트 페이로드 (JSON)
    "status" TEXT NOT NULL DEFAULT 'PENDING', -- 상태 (PENDING: 대기, SENT: 전송완료)
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "outbox_events_pkey" PRIMARY KEY ("id")
);

-- 인덱스 생성
-- 자산 번호에 대한 고유 인덱스 (중복 방지)
CREATE UNIQUE INDEX "assets_asset_number_key" ON "assets" ("asset_number");

-- 테넌트별 자산 조회 성능 향상
CREATE INDEX "assets_tenant_id_idx" ON "assets" ("tenant_id");

-- 자산 상태별 조회 성능 향상
CREATE INDEX "assets_status_idx" ON "assets" ("status");

-- 자산별 이력 조회 성능 향상
CREATE INDEX "asset_history_asset_id_idx" ON "asset_history" ("asset_id");

-- Outbox 이벤트 ID에 대한 고유 인덱스
CREATE UNIQUE INDEX "outbox_events_event_id_key" ON "outbox_events" ("event_id");

-- 외래키 제약조건 추가
-- 자산 이력은 자산 삭제 시 함께 삭제 (CASCADE)
ALTER TABLE "asset_history"
ADD CONSTRAINT "asset_history_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "assets" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
