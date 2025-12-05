-- =====================================================
-- General Affairs Service 초기 마이그레이션
-- 총무 업무(차량 관리 등)를 위한 테이블 생성
-- =====================================================

-- 법인 차량 테이블 생성
-- 회사 소유 또는 렌트 차량 정보 관리
CREATE TABLE "vehicles" (
    "id" TEXT NOT NULL,
    "license_plate" TEXT NOT NULL, -- 차량 번호 (고유 식별자)
    "model" TEXT NOT NULL, -- 차종
    "manufacturer" TEXT, -- 제조사
    "year" INTEGER, -- 연식
    "status" TEXT NOT NULL DEFAULT 'AVAILABLE', -- 상태 (AVAILABLE: 사용가능, IN_USE: 사용중, MAINTENANCE: 정비중)
    "tenant_id" TEXT NOT NULL, -- 테넌트 ID (멀티테넌시)
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id")
);

-- 차량 예약 테이블 생성
-- 법인 차량 사용 예약 관리
CREATE TABLE "vehicle_reservations" (
    "id" TEXT NOT NULL,
    "vehicle_id" TEXT NOT NULL, -- 차량 ID (외래키)
    "user_id" TEXT NOT NULL, -- 사용자 ID
    "start_date" DATE NOT NULL, -- 예약 시작일
    "end_date" DATE NOT NULL, -- 예약 종료일
    "purpose" TEXT, -- 사용 목적
    "status" TEXT NOT NULL DEFAULT 'CONFIRMED', -- 상태 (CONFIRMED: 확정, CANCELLED: 취소)
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "vehicle_reservations_pkey" PRIMARY KEY ("id")
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
-- 차량 번호 중복 방지 인덱스
CREATE UNIQUE INDEX "vehicles_license_plate_key" ON "vehicles" ("license_plate");

-- 테넌트별 차량 조회 성능 향상
CREATE INDEX "vehicles_tenant_id_idx" ON "vehicles" ("tenant_id");

-- 차량 상태별 조회 성능 향상
CREATE INDEX "vehicles_status_idx" ON "vehicles" ("status");

-- 차량별 예약 조회 성능 향상
CREATE INDEX "vehicle_reservations_vehicle_id_idx" ON "vehicle_reservations" ("vehicle_id");

-- 날짜별 예약 조회 성능 향상 (기간 검색 최적화)
CREATE INDEX "vehicle_reservations_start_date_end_date_idx" ON "vehicle_reservations" ("start_date", "end_date");

-- Outbox 이벤트 ID 고유 인덱스
CREATE UNIQUE INDEX "outbox_events_event_id_key" ON "outbox_events" ("event_id");

-- 외래키 제약조건 추가
-- 차량 삭제 시 관련 예약도 함께 삭제 (CASCADE)
ALTER TABLE "vehicle_reservations"
ADD CONSTRAINT "vehicle_reservations_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
