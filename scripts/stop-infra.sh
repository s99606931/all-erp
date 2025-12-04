#!/bin/bash

# 스크립트 위치의 절대 경로 파악
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$SCRIPT_DIR/.."

cd "$PROJECT_ROOT/dev-environment"

echo "🛑 인프라 중지 중..."

docker compose -f docker-compose.infra.yml down

echo "✅ 인프라 중지 완료"
