#!/bin/bash
# ALL-ERP 프론트엔드 서비스 시작
#
# 사용법:
#   ./start-frontend.sh              # Shell만 실행
#   ./start-frontend.sh all          # Shell + 모든 MFE
#   ./start-frontend.sh shell hr     # Shell + HR MFE만

set -e

echo "=================================================="
echo " ALL-ERP 프론트엔드 시작"
echo "=================================================="
echo ""

# 프론트엔드 앱 목록
declare -A FRONTEND_APPS=(
  ["shell"]="apps/frontend/shell:3000"
  ["system"]="apps/frontend/system-mfe:3100"
  ["hr"]="apps/frontend/hr-mfe:3102"
  ["payroll"]="apps/frontend/payroll-mfe:3103"
  ["attendance"]="apps/frontend/attendance-mfe:3104"
  ["budget"]="apps/frontend/budget-mfe:3105"
  ["treasury"]="apps/frontend/treasury-mfe:3106"
  ["accounting"]="apps/frontend/accounting-mfe:3101"
  ["asset"]="apps/frontend/asset-mfe:3107"
  ["inventory"]="apps/frontend/inventory-mfe:3108"
  ["general-affairs"]="apps/frontend/general-affairs-mfe:3109"
)

# 실행할 앱 선택
SELECTED_APPS=()

if [ $# -eq 0 ]; then
    # 대화형 모드
    echo "실행할 프론트엔드 앱을 선택하세요:"
    echo "  1) Shell만 (http://localhost:3000)"
    echo "  2) 전체 (Shell + 모든 MFE)"
    echo "  3) Shell + System"
    echo "  4) Shell + HR (hr, payroll, attendance)"
    echo "  5) Shell + Finance (budget, treasury, accounting)"
    echo "  6) Shell + General (asset, inventory, general-affairs)"
    echo "  7) 직접 선택"
    echo ""
    read -p "선택 (1-7, Enter=1): " choice

    case ${choice:-1} in
        1)
            SELECTED_APPS=("shell")
            ;;
        2)
            SELECTED_APPS=("shell" "system" "hr" "payroll" "attendance" "budget" "treasury" "accounting" "asset" "inventory" "general-affairs")
            ;;
        3)
            SELECTED_APPS=("shell" "system")
            ;;
        4)
            SELECTED_APPS=("shell" "hr" "payroll" "attendance")
            ;;
        5)
            SELECTED_APPS=("shell" "budget" "treasury" "accounting")
            ;;
        6)
            SELECTED_APPS=("shell" "asset" "inventory" "general-affairs")
            ;;
        7)
            echo "앱 이름 입력 (예: shell hr accounting):"
            read -p "> " custom_apps
            SELECTED_APPS=($custom_apps)
            ;;
        *)
            echo "잘못된 선택입니다. Shell만 실행합니다."
            SELECTED_APPS=("shell")
            ;;
    esac
else
    # 명령줄 인수 모드
    if [ "$1" == "all" ]; then
        SELECTED_APPS=("shell" "system" "hr" "payroll" "attendance" "budget" "treasury" "accounting" "asset" "inventory" "general-affairs")
    else
        SELECTED_APPS=("$@")
    fi
fi

echo ""
echo "선택된 앱: ${SELECTED_APPS[@]}"
echo ""

# pnpm 확인
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm이 설치되지 않았습니다."
    echo "   npm install -g pnpm"
    exit 1
fi

# 루트로 이동
cd ..

# 의존성 설치 (처음 한 번만)
if [ ! -d "node_modules" ]; then
    echo "📦 루트 의존성 설치 중..."
    pnpm install
fi

# 각 앱 시작
LOG_DIR="dev-environment/logs/frontend"
mkdir -p "$LOG_DIR"

PIDS=()

for app in "${SELECTED_APPS[@]}"; do
    if [[ ! ${FRONTEND_APPS[$app]+_} ]]; then
        echo "⚠️  알 수 없는 앱: $app (건너뜀)"
        continue
    fi

    APP_INFO="${FRONTEND_APPS[$app]}"
    APP_PATH="${APP_INFO%:*}"
    APP_PORT="${APP_INFO#*:}"

    echo "🚀 $app 시작 중 (포트 $APP_PORT)..."

    # 앱 디렉토리로 이동하여 실행
    cd "$APP_PATH"
    
    # 의존성 설치 (필요 시)
    if [ ! -d "node_modules" ]; then
        echo "   📦 $app 의존성 설치 중..."
        pnpm install
    fi

    # 백그라운드로 실행 및 로그 저장
    LOG_FILE="../../$LOG_DIR/$app.log"
    nohup pnpm dev > "$LOG_FILE" 2>&1 &
    PID=$!
    PIDS+=($PID)

    echo "   ✅ $app 시작 완료 (PID: $PID, 로그: $LOG_FILE)"
    
    # 루트로 돌아가기
    cd - > /dev/null
    
    # 다음 앱 시작 전 대기
    sleep 2
done

echo ""
echo "=================================================="
echo " ✅ 프론트엔드 시작 완료!"
echo "=================================================="
echo ""
echo "📌 실행 중인 앱:"
echo ""

for app in "${SELECTED_APPS[@]}"; do
    if [[ ${FRONTEND_APPS[$app]+_} ]]; then
        APP_INFO="${FRONTEND_APPS[$app]}"
        APP_PORT="${APP_INFO#*:}"
        echo "  🌐 $app: http://localhost:$APP_PORT"
    fi
done

echo ""
echo "📝 로그 디렉토리: dev-environment/logs/frontend/"
echo ""
echo "⚠️  프로세스 종료:"
echo "   kill ${PIDS[@]}"
echo "   또는 ./stop-frontend.sh"
echo ""

# PID 파일 저장
echo "${PIDS[@]}" > dev-environment/.frontend-pids
