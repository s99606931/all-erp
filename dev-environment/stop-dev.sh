#!/bin/bash
# ALL-ERP 개발 환경 중지

echo "=================================================="
echo " ALL-ERP 개발 환경 중지"
echo "=================================================="
echo ""
echo "중지할 환경을 선택하세요:"
echo "  1) 전체 제거 (컨테이너 완전 삭제)"
echo "  2) 개발 환경만 중지 (인프라 유지)"
echo "  3) 개발 + 인프라 중지"
echo "  4) DevOps 도구 중지"
echo "  5) 전체 중지 (개발 + 인프라 + DevOps)"
echo ""
read -p "선택 (1-5): " choice

case $choice in
  1)
    echo ""
    echo "⚠️  경고: 모든 컨테이너와 네트워크가 제거됩니다."
    read -p "정말 제거하시겠습니까? (y/N): " confirm
    if [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]]; then
      echo ""
      echo "전체 환경 제거 중..."
      docker compose -f docker-compose.dev.yml --profile system --profile hr --profile finance --profile general --profile ai down
      docker compose -f docker-compose.infra.yml down
      docker compose -f docker-compose.devops.yml down
      echo "✅ 모든 컨테이너와 네트워크가 제거되었습니다."
      echo ""
      echo "💡 볼륨도 삭제하려면 다음 명령어를 실행하세요:"
      echo "   docker compose -f docker-compose.infra.yml down -v"
    else
      echo "❌ 취소되었습니다."
      exit 0
    fi
    ;;
  2)
    echo ""
    echo "개발 환경만 중지 중..."
    docker compose -f docker-compose.dev.yml --profile system --profile hr --profile finance --profile general --profile ai down
    echo "✅ 개발 환경이 중지되었습니다. (인프라는 계속 실행 중)"
    ;;
  3)
    echo ""
    echo "개발 + 인프라 환경 중지 중..."
    docker compose -f docker-compose.dev.yml --profile system --profile hr --profile finance --profile general --profile ai down
    docker compose -f docker-compose.infra.yml down
    echo "✅ 개발 환경과 인프라가 중지되었습니다."
    ;;
  4)
    echo ""
    echo "DevOps 도구 중지 중..."
    docker compose -f docker-compose.devops.yml down
    echo "✅ DevOps 도구가 중지되었습니다."
    ;;
  5)
    echo ""
    echo "전체 환경 중지 중..."
    docker compose -f docker-compose.dev.yml --profile system --profile hr --profile finance --profile general --profile ai down
    docker compose -f docker-compose.infra.yml down
    docker compose -f docker-compose.devops.yml down
    echo "✅ 모든 서비스가 중지되었습니다."
    ;;
  *)
    echo "❌ 잘못된 선택입니다."
    exit 1
    ;;
esac

echo ""
echo "💡 팁: 중지된 컨테이너를 다시 시작하려면:"
echo "   ./start-dev.sh"

echo ""
