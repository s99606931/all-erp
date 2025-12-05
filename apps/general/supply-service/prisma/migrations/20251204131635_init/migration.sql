-- =====================================================
-- Supply Service 초기 마이그레이션
-- 비품 및 재고 관리를 위한 테이블 생성
-- =====================================================

-- 비품 재고 테이블 생성
-- 사무용품, 장비 등의 재고 현황 관리
CREATE TABLE "inventories" (
    "id" TEXT NOT NULL,
    "item_name" TEXT NOT NULL, -- 품목명
    "item_code" TEXT NOT NULL, -- 품목 코드 (고유 식별자)
    "quantity" DECIMAL(15, 2) NOT NULL DEFAULT 0, -- 현재 재고량
    "min_quantity" DECIMAL(15, 2) NOT NULL DEFAULT 0, -- 최소 유지 재고량 (부족 알림 기준)
    "unit" TEXT NOT NULL DEFAULT 'EA', -- 단위 (EA, BOX, KG 등)
    "tenant_id" TEXT NOT NULL, -- 테넌트 ID (멀티테넌시)
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "inventories_pkey" PRIMARY KEY ("id")
);

-- 재고 이동 이력 테이블 생성
-- 입고, 출고 등 재고 수량 변경 이력 관리
CREATE TABLE "inventory_transactions" (
    "id" TEXT NOT NULL,
    "inventory_id" TEXT NOT NULL, -- 재고 ID (외래키)
    "type" TEXT NOT NULL, -- 이동 유형 (IN: 입고, OUT: 출고)
    "quantity" DECIMAL(15, 2) NOT NULL, -- 이동 수량
    "date" DATE NOT NULL, -- 이동 일자
    "description" TEXT, -- 비고/설명
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "inventory_transactions_pkey" PRIMARY KEY ("id")
);

-- 처리된 이벤트 테이블 생성
-- 중복 이벤트 처리 방지를 위한 이벤트 추적
CREATE TABLE "processed_events" (
    "event_id" TEXT NOT NULL, -- 이벤트 ID
    "event_type" TEXT NOT NULL, -- 이벤트 타입
    "processed_at" TIMESTAMP(3) NOT NULL, -- 처리 일시
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "processed_events_pkey" PRIMARY KEY ("event_id")
);

-- Outbox 이벤트 테이블 생성
-- 트랜잭셔널 아웃박스 패턴을 위한 이벤트 저장소
CREATE TABLE "outbox_events" (
    "id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL, -- 이벤트 ID
    "event_type" TEXT NOT NULL, -- 이벤트 타입
    "payload" TEXT NOT NULL, -- 이벤트 페이로드 (JSON)
    "status" TEXT NOT NULL DEFAULT 'PENDING', -- 상태
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "outbox_events_pkey" PRIMARY KEY ("id")
);

-- 인덱스 생성
-- 품목 코드 중복 방지 인덱스
CREATE UNIQUE INDEX "inventories_item_code_key" ON "inventories" ("item_code");

-- 테넌트별 재고 조회 성능 향상
CREATE INDEX "inventories_tenant_id_idx" ON "inventories" ("tenant_id");

-- 재고별 트랜잭션 조회 성능 향상
CREATE INDEX "inventory_transactions_inventory_id_idx" ON "inventory_transactions" ("inventory_id");

-- 날짜별 트랜잭션 조회 성능 향상
CREATE INDEX "inventory_transactions_date_idx" ON "inventory_transactions" ("date");

-- Outbox 이벤트 ID 고유 인덱스
CREATE UNIQUE INDEX "outbox_events_event_id_key" ON "outbox_events" ("event_id");

-- 외래키 제약조건 추가
-- 재고 삭제 시 관련 트랜잭션도 함께 삭제 (CASCADE)
ALTER TABLE "inventory_transactions"
ADD CONSTRAINT "inventory_transactions_inventory_id_fkey" FOREIGN KEY ("inventory_id") REFERENCES "inventories" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
