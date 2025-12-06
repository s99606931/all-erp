#!/bin/bash
set -e
# DB 스키마 변경 후
# 스크립트 실행 중 에러 발생 시 즉시 종료 설정
# set -e: 명령어가 0이 아닌 상태로 종료되면 스크립트 실행을 멈춤

# 스크립트 위치를 기준으로 프로젝트 루트 디렉토리 설정 (.. 경로)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# 프로젝트 루트로 이동
cd "$PROJECT_ROOT"
echo "📂 Working directory: $(pwd)"

echo "🧹 Cleaning up node_modules and dist directories..."
# 권한 문제 해결을 위해 sudo를 사용하여 node_modules와 dist 디렉토리 일괄 삭제
# find 명령어를 사용하여 현재 디렉토리 하위의 모든 node_modules와 dist를 찾아 삭제
sudo find . -name "node_modules" -type d -prune -exec rm -rf {} +
sudo find . -name "dist" -type d -prune -exec rm -rf {} +

echo "📦 Installing dependencies..."
pnpm install

echo "🧹 Removing any existing .prisma directories to avoid permission issues..."
# pnpm install 과정에서 생성되었을 수 있는 .prisma 폴더를 sudo 권한으로 삭제
# 이를 통해 이후 prisma generate 실행 시 권한 충돌 방지
sudo find . -type d -path "*/node_modules/.prisma" -exec rm -rf {} +


echo " Finding all schema.prisma files..."

# schema.prisma 파일 검색
# - node_modules, dist, dev-environment 폴더는 검색에서 제외 (prune)
# - 이름이 schema.prisma인 파일만 찾아서 리스트에 저장
SCHEMAS=$(find . -path "*/node_modules" -prune -o -path "*/dist" -prune -o -path "*/dev-environment" -prune -o -name "schema.prisma" -type f -print)

# 검색된 스키마 파일이 없는 경우 처리
if [ -z "$SCHEMAS" ]; then
  echo "⚠️  No schema.prisma files found."
  exit 0
fi

echo "🚀 Generating Prisma Clients..."

# 검색된 각 스키마 파일에 대해 Prisma Client 생성 반복 수행
for schema in $SCHEMAS; do
  echo "👉 Processing: $schema"
  
  # 스키마 경로에서 서비스 디렉토리 추출 (예: apps/finance/budget-service/prisma/schema.prisma -> apps/finance/budget-service)
  # 스키마 경로에서 서비스 디렉토리 추출
  SERVICE_DIR=$(dirname $(dirname "$schema"))
  NODE_MODULES="$SERVICE_DIR/node_modules"
  PRISMA_OUT="$NODE_MODULES/.prisma"
  
  # node_modules가 있다면 소유권을 현재 사용자로 변경
  if [ -d "$NODE_MODULES" ]; then
    # echo "   🔧 Fixing ownership of $NODE_MODULES"
    sudo chown -R $(whoami) "$NODE_MODULES"
  fi

  # 기존 .prisma 폴더가 있다면 소유권 확보 후 완전히 삭제 (깨끗한 생성 보장)
  if [ -d "$PRISMA_OUT" ]; then
    # echo "   🔧 Ensuring ownership and removing $PRISMA_OUT"
    sudo chown -R $(whoami) "$PRISMA_OUT"
    sudo chmod -R u+w "$PRISMA_OUT"
    rm -rf "$PRISMA_OUT"
  fi

  # 해당 스키마 경로를 지정하여 prisma generate 실행
  npx prisma generate --schema="$schema"
done

echo "✅ All Prisma Clients generated successfully!"
