#!/bin/bash
# ALL-ERP 프론트엔드 서비스 시작 (Docker Compose 기반)
#
# 사용법:
#   ./start-frontend.sh              # 대화형 모드
#   ./start-frontend.sh all          # 전체 MFE 실행
#   ./start-frontend.sh shell        # Shell만 실행
#   ./start-frontend.sh system hr    # 여러 앱 동시 실행

set -e

echo "=================================================="
echo " ALL-ERP 프론트엔드 시작 (Docker Compose)"
echo "=================================================="
echo ""

# 고아 컨테이너 경고 숨기기
export COMPOSE_IGNORE_ORPHANS=True

# 1. .env 파일 확인 (Apps별 .env는 각 폴더에 존재)
# 루트 .env는 인프라/네트워크용으로 필요할 수 있음
if [ ! -f "../.env" ]; then
    echo "⚠️  루트 .env 파일이 없습니다. (인프라 구성용)"
fi

# 2. Docker 실행 확인
if ! docker ps > /dev/null 2>&1; then
    echo "❌ Docker가 실행되지 않았습니다."
    exit 1
fi

# 앱 별칭 -> Compose 서비스 이름 매핑
declare -A APP_MAP=(
  ["shell"]="shell"
  ["system"]="system-mfe"
  ["hr"]="hr-mfe"
  ["payroll"]="payroll-mfe"
  ["attendance"]="attendance-mfe"
  ["budget"]="budget-mfe"
  ["treasury"]="treasury-mfe"
  ["accounting"]="accounting-mfe"
  ["asset"]="asset-mfe"
  ["inventory"]="inventory-mfe"
  ["general-affairs"]="general-affairs-mfe"
)

TARGET_SERVICES=""

if [ $# -eq 0 ]; then
    # 대화형 모드
    echo "실행할 프론트엔드 앱을 선택하세요:"
    echo "  1) 전체 (Shell + 모든 MFE)"
    echo "  2) Shell만 (http://localhost:3000)"
    echo "  3) Shell + System"
    echo "  4) Shell + HR (hr, payroll, attendance)"
    echo "  5) Shell + Finance (budget, treasury, accounting)"
    echo "  6) Shell + General (asset, inventory, general-affairs)"
    echo "  7) 직접 입력"
    echo ""
    read -p "선택 (1-7, Enter=1): " choice

    case ${choice:-1} in
        1)
            # 전체 실행 시 서비스 명시 안 함 (파일 내 전체 실행)
            TARGET_SERVICES=""
            ;;
        2)
            TARGET_SERVICES="shell"
            ;;
        3)
            TARGET_SERVICES="shell system-mfe"
            ;;
        4)
            TARGET_SERVICES="shell hr-mfe payroll-mfe attendance-mfe"
            ;;
        5)
            TARGET_SERVICES="shell budget-mfe treasury-mfe accounting-mfe"
            ;;
        6)
            TARGET_SERVICES="shell asset-mfe inventory-mfe general-affairs-mfe"
            ;;
        7)
            echo "앱 이름 입력 (별칭 예: shell system hr):"
            read -p "> " custom_input
            for item in $custom_input; do
                if [[ ${APP_MAP[$item]+_} ]]; then
                    TARGET_SERVICES="$TARGET_SERVICES ${APP_MAP[$item]}"
                else
                     # 매핑 없으면 입력값 그대로 시도 (서비스명 직접 입력 대비)
                    TARGET_SERVICES="$TARGET_SERVICES $item"
                fi
            done
            ;;
        *)
            echo "잘못된 선택입니다. Docker Compose 전체를 실행합니다."
            TARGET_SERVICES=""
            ;;
    esac
else
    # 명령줄 인수 모드
    if [ "$1" == "all" ]; then
        TARGET_SERVICES=""
    else
        for arg in "$@"; do
            if [[ ${APP_MAP[$arg]+_} ]]; then
                TARGET_SERVICES="$TARGET_SERVICES ${APP_MAP[$arg]}"
            else
                TARGET_SERVICES="$TARGET_SERVICES $arg"
            fi
        done
    fi
fi

echo "🚀 프론트엔드 서비스 시작 중..."
echo "Target Services: ${TARGET_SERVICES:-ALL}"

# Docker Compose 실행
# infra.yml을 포함하여 네트워크 컨텍스트 공유 (단, infra가 없으면 Warning 뜰 수 있음)
# start-dev.sh와 일관성을 위해 infra.yml 포함하되, 명시된 서비스만 up.
# TARGET_SERVICES가 비어있으면(ALL), infra.yml의 서비스도 up 될 수 있음.
# 이를 방지하기 위해 ALL인 경우 frontend 파일의 서비스 목록을 추출하거나, 
# 사용자가 'all'을 원하면 인프라도 체크하는게 맞음.
# 여기서는 frontend 파일만 지정해서 전체 실행(ALL) 하도록 함. 
# 하지만 external network 때문에 infra가 선행되어야 함.

if [ -z "$TARGET_SERVICES" ]; then
    # 전체 실행: Frontend 파일만 사용 (네트워크는 external이므로 존재해야 함)
    docker compose -f docker-compose.frontend.dev.yml up -d --build
else
    # 부분 실행: 해당 서비스만 Up
    docker compose -f docker-compose.frontend.dev.yml up -d --build $TARGET_SERVICES
fi

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 시작 완료!"
    echo "Shell: http://localhost:3000"
    docker compose -f docker-compose.frontend.dev.yml ps
else
    echo "❌ 시작 실패"
    exit 1
fi
