#!/bin/bash
# ALL-ERP 프론트엔드 중지

echo "=================================================="
echo " ALL-ERP 프론트엔드 중지"
echo "=================================================="
echo ""

PID_FILE="dev-environment/.frontend-pids"

if [ -f "$PID_FILE" ]; then
    PIDS=$(cat "$PID_FILE")
    
    if [ -n "$PIDS" ]; then
        echo "프론트엔드 프로세스 종료 중..."
        for PID in $PIDS; do
            if ps -p $PID > /dev/null 2>&1; then
                kill $PID
                echo "  ✅ PID $PID 종료"
            else
                echo "  ℹ️  PID $PID 이미 종료됨"
            fi
        done
        rm "$PID_FILE"
    else
        echo "실행 중인 프론트엔드 프로세스가 없습니다."
    fi
else
    echo "PID 파일을 찾을 수 없습니다."
    echo "수동으로 프로세스를 종료하거나 다음 명령을 실행하세요:"
    echo "  pkill -f 'pnpm dev'"
fi

echo ""
echo "✅ 프론트엔드 중지 완료"
echo ""
