#!/bin/bash
# ALL-ERP 프론트엔드 중지 (Docker Compose 기반)

echo "=================================================="
echo " ALL-ERP 프론트엔드 중지"
echo "=================================================="
echo ""

# 고아 컨테이너 경고 숨기기
export COMPOSE_IGNORE_ORPHANS=True

echo "프론트엔드 컨테이너 종료 중..."

# Frontend Compose 파일만 내림
docker compose -f docker-compose.frontend.dev.yml down

if [ $? -eq 0 ]; then
    echo "✅ 프론트엔드 중지 완료"
else
    echo "❌ 중지 실패"
fi
