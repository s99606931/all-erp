#!/bin/bash
# ALL-ERP 개발 환경 시작 (Docker Compose 기반)

echo "=================================================="
echo " ALL-ERP 개발 환경 시작"
echo "=================================================="
echo ""

# 고아 컨테이너 경고 숨기기
export COMPOSE_IGNORE_ORPHANS=True

# 1. .env 파일 확인
if [ ! -f "../.env" ]; then
    echo "[1/6] .env 파일 생성..."
    cp ../envs/development.env ../.env
    echo "      ✅ .env 파일 생성 완료"
else
    echo "[1/6] ✅ .env 파일 확인 완료"
fi

# 2. Docker 실행 확인
echo "[2/6] Docker 실행 확인..."
if ! docker ps > /dev/null 2>&1; then
    echo "      ❌ Docker가 실행되지 않았습니다."
    echo "      Docker Desktop을 시작하세요."
    exit 1
fi
echo "      ✅ Docker 실행 중"

# 3. 인프라 서비스 시작
echo "[3/6] 인프라 서비스 시작 (PostgreSQL, Redis 등)..."
docker compose -f docker-compose.infra.yml up -d

if [ $? -ne 0 ]; then
    echo "      ❌ 인프라 시작 실패!"
    exit 1
fi
echo "      ✅ 인프라 시작 완료"

# 4. 개발 환경 시작
echo "[4/6] 개발 환경 시작 (애플리케이션 서비스)..."
echo ""
echo "실행할 서비스 프로필을 선택하세요:"
echo "  1) 전체 (system + hr + finance + general + ai)"
echo "  2) System (인증, 시스템, 테넌트)"
echo "  3) HR (인사, 급여, 근태)"
echo "  4) Finance (예산, 회계, 결산)"
echo "  5) General (자산, 비품, 총무)"
echo "  6) AI (AI 서비스, Web Admin)"
echo "  7) 프로필을 직접 입력"
echo ""
read -p "선택 (1-7, Enter=전체): " profile_choice

case ${profile_choice:-1} in
  1)
    PROFILES="--profile system --profile hr --profile finance --profile general --profile ai"
    ;;
  2)
    PROFILES="--profile system"
    ;;
  3)
    PROFILES="--profile hr"
    ;;
  4)
    PROFILES="--profile finance"
    ;;
  5)
    PROFILES="--profile general"
    ;;
  6)
    PROFILES="--profile ai"
    ;;
  7)
    read -p "프로필 입력 (예: system hr): " custom_profiles
    PROFILES=""
    for p in $custom_profiles; do
      PROFILES="$PROFILES --profile $p"
    done
    ;;
  *)
    echo "      ⚠️  잘못된 선택입니다. 전체 프로필로 실행합니다."
    PROFILES="--profile system --profile hr --profile finance --profile general --profile ai"
    ;;
esac

echo "      선택된 프로필: $PROFILES"
docker compose -f docker-compose.infra.yml -f docker-compose.dev.yml $PROFILES up -d --build

if [ $? -ne 0 ]; then
    echo "      ❌ 개발 환경 시작 실패!"
    exit 1
fi
echo "      ✅ 개발 환경 시작 완료"

# 5. DevOps 도구 시작
echo "[5/6] DevOps 도구 시작 (GitLab, Prometheus 등)..."
docker compose -f docker-compose.devops.yml up -d

if [ $? -ne 0 ]; then
    echo "      ⚠️  DevOps 도구 시작 실패 (계속 진행)"
else
    echo "      ✅ DevOps 도구 시작 완료"
fi

# 6. 서비스 상태 확인
echo "[6/6] 서비스 상태 확인 (10초 대기)..."
sleep 10
docker compose -f docker-compose.infra.yml ps
echo ""
echo "애플리케이션 서비스:"
docker compose -f docker-compose.infra.yml -f docker-compose.dev.yml $PROFILES ps

echo ""
echo "=================================================="
echo " ✅ 개발 환경 준비 완료!"
echo "=================================================="
echo ""
echo "📌 실행 중인 서비스:"
echo ""
echo "  🗄️  인프라:"
echo "     PostgreSQL:  localhost:5432"
echo "     Redis:       localhost:6379"
echo "     RabbitMQ:    http://localhost:15672 (admin/admin)"
echo ""
echo "  🚀 애플리케이션:"
echo "     Auth Service:   http://localhost:3001"
echo "     System Service: http://localhost:3002"
echo "     Tenant Service: http://localhost:3006"
echo ""
echo "  �️  DevOps 도구:"
echo "     GitLab:         http://localhost:8980 (root/changeme123!)"
echo "     Prometheus:     http://localhost:9090"
echo "     Grafana:        http://localhost:3000 (admin/admin)"
echo ""
echo "📝 다음 단계:"
echo ""
echo "  1️⃣  로그 확인:"
echo "     docker compose -f docker-compose.dev.yml logs -f auth-service"
echo ""
echo "  2️⃣  서비스 중지:"
echo "     ./stop-dev.sh"
echo ""
