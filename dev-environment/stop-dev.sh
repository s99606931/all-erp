#!/bin/bash
# ALL-ERP 개발 환경 중지

echo "=================================================="
echo " ALL-ERP 개발 환경 중지"
echo "=================================================="
echo ""

echo "중지할 환경을 선택하세요:"
echo "  1) 개발 환경만 중지 (인프라 유지)"
echo "  2) 전체 중지 (인프라 + 개발 환경)"
echo "  3) DevOps 도구 중지"
echo ""
read -p "선택 (1-3): " choice

case $choice in
    1)
        echo ""
        echo "개발 환경 중지 중..."
        docker compose -f docker-compose.dev.yml stop
        echo "✅ 개발 환경이 중지되었습니다. (인프라는 계속 실행 중)"
        ;;
    2)
        echo ""
        echo "전체 환경 중지 중..."
        docker compose -f docker-compose.dev.yml stop
        docker compose -f docker-compose.infra.yml stop
        echo "✅ 모든 서비스가 중지되었습니다."
        ;;
    3)
        echo ""
        echo "DevOps 도구 중지 중..."
        docker compose -f docker-compose.devops.yml stop
        echo "✅ DevOps 도구가 중지되었습니다."
        ;;
    *)
        echo "❌ 잘못된 선택입니다."
        exit 1
        ;;
esac

echo ""
echo "💡 팁: 컨테이너를 완전히 제거하려면 'down' 명령어를 사용하세요."
echo "   docker compose -f docker-compose.infra.yml -f docker-compose.dev.yml down"
echo ""
