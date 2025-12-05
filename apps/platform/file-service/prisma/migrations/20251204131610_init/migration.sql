-- =====================================================
-- File Service 초기 마이그레이션
-- 공통 파일 처리를 위한 테이블 생성
-- =====================================================

-- 파일 테이블 생성
-- 업로드된 파일의 메타데이터 및 스토리지 URL 관리
CREATE TABLE "files" (
    "id" TEXT NOT NULL,
    "file_name" TEXT NOT NULL, -- 저장된 파일명
    "original_name" TEXT NOT NULL, -- 원본 파일명
    "mime_type" TEXT NOT NULL, -- 파일 타입 (MIME)
    "size" INTEGER NOT NULL, -- 파일 크기 (bytes)
    "storage_url" TEXT NOT NULL, -- 파일 스토리지 URL (S3, Minio 등)
    "uploader_id" TEXT NOT NULL, -- 업로더 ID
    "tenant_id" TEXT NOT NULL, -- 테넌트 ID
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
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
-- 테넌트별 파일 조회
CREATE INDEX "files_tenant_id_idx" ON "files" ("tenant_id");

-- 업로더별 파일 조회
CREATE INDEX "files_uploader_id_idx" ON "files" ("uploader_id");

CREATE UNIQUE INDEX "outbox_events_event_id_key" ON "outbox_events" ("event_id");
