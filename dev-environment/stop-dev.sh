#!/bin/bash
# ALL-ERP 개발 환경 중지

echo "=================================================="
echo " ALL-ERP 개발 환경 중지"
echo "=================================================="
echo ""

# 고아 컨테이너 경고 숨기기
export COMPOSE_IGNORE_ORPHANS=True

# 1. 애플리케이션 서비스 중지
echo "[1/3] 애플리케이션 서비스 중지..."
docker compose -f docker-compose.dev.yml down

if [ $? -eq 0 ]; then
    echo "      ✅ 애플리케이션 서비스 중지 완료"
else
    echo "      ⚠️  애플리케이션 서비스 중지 중 오류 발생"
fi

# 2. DevOps 도구 중지 (있는 경우)
echo "[2/3] DevOps 도구 중지..."
docker compose -f docker-compose.devops.yml down 2>/dev/null

if [ $? -eq 0 ]; then
    echo "      ✅ DevOps 도구 중지 완료"
else
    echo "      ℹ️  DevOps 도구 없음 또는 이미 중지됨"
fi

# 3. 인프라 서비스 중지 여부 확인
echo "[3/3] 인프라 서비스 중지 여부 확인..."
echo ""
read -p "인프라 서비스(PostgreSQL, Redis 등)도 중지하시겠습니까? (y/N): " stop_infra

if [[ "$stop_infra" =~ ^[Yy]$ ]]; then
    echo "      인프라 서비스 중지 중..."
    docker compose -f docker-compose.infra.yml down
    
    if [ $? -eq 0 ]; then
        echo "      ✅ 인프라 서비스 중지 완료"
    else
        echo "      ❌ 인프라 서비스 중지 실패"
    fi
else
    echo "      ℹ️  인프라 서비스는 계속 실행됩니다."
fi

echo ""
echo "=================================================="
echo " ✅ 개발 환경 중지 완료"
echo "=================================================="
echo ""
echo "📝 참고:"
echo "  - 데이터 볼륨은 유지됩니다."
echo "  - 모든 컨테이너와 볼륨을 삭제하려면:"
echo "    docker compose -f docker-compose.infra.yml down -v"
echo "    docker compose -f docker-compose.dev.yml down -v"
echo ""
