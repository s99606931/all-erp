#!/bin/bash
# ALL-ERP 개발 환경 시작 (Docker Compose 기반)
#
# 사용법:
#   ./start-dev.sh              # 대화형 모드
#   ./start-dev.sh all          # 전체 서비스
#   ./start-dev.sh system       # System 서비스만
#   ./start-dev.sh system hr    # 여러 프로필 동시 실행

set -e  # 오류 발생 시 즉시 중단

echo "=================================================="
echo " ALL-ERP 개발 환경 시작"
echo "=================================================="
echo ""

# 고아 컨테이너 경고 숨기기
export COMPOSE_IGNORE_ORPHANS=True

# 1. .env 파일 확인
if [ ! -f "../.env" ]; then
    echo "[1/5] .env 파일 생성..."
    if [ -f "../envs/development.env" ]; then
        cp ../envs/development.env ../.env
        echo "      ✅ .env 파일 생성 완료"
    else
        echo "      ⚠️  envs/development.env 파일이 없습니다."
        echo "      기본 .env 파일을 수동으로 생성하세요."
    fi
else
    echo "[1/5] ✅ .env 파일 확인 완료"
fi

# 2. Docker 실행 확인
echo "[2/5] Docker 실행 확인..."
if ! docker ps > /dev/null 2>&1; then
    echo "      ❌ Docker가 실행되지 않았습니다."
    echo "      Docker Desktop을 시작하세요."
    exit 1
fi
echo "      ✅ Docker 실행 중"

# 3. 인프라 서비스 시작
echo "[3/5] 인프라 서비스 시작 (PostgreSQL, Redis, RabbitMQ 등)..."
docker compose -f docker-compose.infra.yml up -d

if [ $? -ne 0 ]; then
    echo "      ❌ 인프라 시작 실패!"
    exit 1
fi
echo "      ✅ 인프라 시작 완료"

# 인프라 헬스체크 대기
echo "      인프라 서비스 헬스체크 대기 중..."
sleep 5

# 4. 프로필 선택
PROFILES=""

if [ $# -eq 0 ]; then
    # 대화형 모드
    echo "[4/5] 애플리케이션 서비스 프로필 선택..."
    echo ""
    echo "실행할 서비스 프로필을 선택하세요:"
    echo "  1) 전체 (system + hr + finance + general + ai + platform)"
    echo "  2) System (인증, 시스템, 테넌트)"
    echo "  3) HR (인사, 급여, 근태)"
    echo "  4) Finance (예산, 회계, 결산)"
    echo "  5) General (자산, 비품, 총무)"
    echo "  6) Platform (결재, 보고서, 파일, 알림)"
    echo "  7) AI (AI 서비스, Web Admin)"
    echo "  8) 프로필을 직접 입력"
    echo ""
    read -p "선택 (1-8, Enter=전체): " profile_choice

    case ${profile_choice:-1} in
      1)
        PROFILES="--profile system --profile hr --profile finance --profile general --profile ai --profile platform"
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
        PROFILES="--profile platform"
        ;;
      7)
        PROFILES="--profile ai"
        ;;
      8)
        read -p "프로필 입력 (예: system hr platform): " custom_profiles
        PROFILES=""
        for p in $custom_profiles; do
          PROFILES="$PROFILES --profile $p"
        done
        ;;
      *)
        echo "      ⚠️  잘못된 선택입니다. 전체 프로필로 실행합니다."
        PROFILES="--profile system --profile hr --profile finance --profile general --profile ai --profile platform"
        ;;
    esac
else
    # 명령줄 인수 모드
    echo "[4/5] 애플리케이션 서비스 프로필 설정..."
    if [ "$1" == "all" ]; then
        PROFILES="--profile system --profile hr --profile finance --profile general --profile ai --profile platform"
    else
        for arg in "$@"; do
            PROFILES="$PROFILES --profile $arg"
        done
    fi
fi

echo "      선택된 프로필: $PROFILES"
echo ""

# 개발 환경 시작 (--build 플래그로 항상 최신 이미지 사용)
echo "      애플리케이션 서비스 빌드 및 시작 중..."
docker compose -f docker-compose.infra.yml -f docker-compose.dev.yml $PROFILES up -d --build

if [ $? -ne 0 ]; then
    echo "      ❌ 애플리케이션 서비스 시작 실패!"
    exit 1
fi
echo "      ✅ 애플리케이션 서비스 시작 완료"

# 5. 서비스 상태 확인
echo "[5/5] 서비스 상태 확인 (10초 대기)..."
sleep 10

echo ""
echo "📦 인프라 서비스:"
docker compose -f docker-compose.infra.yml ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"

echo ""
echo "🚀 애플리케이션 서비스:"
docker compose -f docker-compose.infra.yml -f docker-compose.dev.yml $PROFILES ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"

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
echo "     Minio:       http://localhost:9001 (minioadmin/minioadmin)"
echo "     MongoDB:     localhost:27017"
echo ""
echo "  🚀 System 서비스 (profile: system):"
echo "     Auth Service:   http://localhost:3001"
echo "     System Service: http://localhost:3002"
echo "     Tenant Service: http://localhost:3006"
echo ""
echo "  👥 HR 서비스 (profile: hr):"
echo "     Personnel Service: http://localhost:3011"
echo "     Payroll Service:   http://localhost:3012"
echo "     Attendance Service: http://localhost:3013"
echo ""
echo "  💰 Finance 서비스 (profile: finance):"
echo "     Budget Service:     http://localhost:3021"
echo "     Accounting Service: http://localhost:3022"
echo "     Settlement Service: http://localhost:3023"
echo ""
echo "  📦 General 서비스 (profile: general):"
echo "     Asset Service:          http://localhost:3031"
echo "     Supply Service:         http://localhost:3032"
echo "     General Affairs Service: http://localhost:3033"
echo ""
echo "  🤖 AI 서비스 (profile: ai):"
echo "     AI Service:  http://localhost:3007"
echo "     Web Admin:   http://localhost:4200"
echo ""
echo "  🔧 Platform 서비스 (profile: platform):"
echo "     Approval Service:     http://localhost:3041"
echo "     Report Service:       http://localhost:3042"
echo "     Notification Service: http://localhost:3043"
echo "     File Service:         http://localhost:3044"
echo ""
echo "📝 다음 단계:"
echo ""
echo "  1️⃣  로그 확인:"
echo "     docker compose -f docker-compose.dev.yml logs -f auth-service"
echo ""
echo "  2️⃣  특정 프로필 추가 실행:"
echo "     docker compose -f docker-compose.infra.yml -f docker-compose.dev.yml --profile hr up -d"
echo ""
echo "  3️⃣  서비스 중지:"
echo "     ./stop-dev.sh"
echo ""
echo "  4️⃣  E2E 테스트 실행:"
echo "     cd .. && pnpm exec playwright test"
echo ""
