#!/bin/bash
# ALL-ERP 개발 환경 시작 (기본 인프라)

echo "=================================================="
echo " ALL-ERP 개발 환경 시작"
echo "=================================================="
echo ""

# 1. .env 파일 확인
if [ ! -f ".env" ]; then
    echo "[1/5] .env 파일 생성..."
    cp .env.example .env
    echo "      ✅ .env 파일 생성 완료"
else
    echo "[1/5] ✅ .env 파일 확인 완료"
fi

# 2. Docker 실행 확인
echo "[2/5] Docker 실행 확인..."
if ! docker ps > /dev/null 2>&1; then
    echo "      Docker 시작 중..."
    sudo service docker start
    sleep 2
fi
echo "      ✅ Docker 실행 중"

# 3. 인프라 서비스 시작
echo "[3/5] 기본 인프라 서비스 시작..."
docker compose --profile all up -d

if [ $? -eq 0 ]; then
    echo "[4/5] ✅ 시작 완료"
else
    echo "      ❌ 시작 실패!"
    exit 1
fi

# 5. 서비스 상태 확인
echo "[5/5] 서비스 상태 확인 (10초 대기)..."
sleep 10
docker compose ps

echo ""
echo "=================================================="
echo " ✅ 개발 환경 준비 완료!"
echo "=================================================="
echo ""
echo "📌 다음 단계:"
echo ""
echo "  1️⃣  애플리케이션 개발:"
echo "     cd .."
echo "     pnpm install"
echo "     pnpm nx serve auth-service"
echo ""
echo "  2️⃣  서비스 중지:"
echo "     ./stop-dev.sh"
echo ""
echo "🔗 접속 주소:"
echo "  PostgreSQL: localhost:5432"
echo "  Redis:      localhost:6379"
echo "  RabbitMQ:   http://localhost:15672 (admin/admin)"
echo "  MinIO:      http://localhost:9001 (minioadmin/minioadmin)"
echo ""
