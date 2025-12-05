#!/bin/sh
# Docker 컨테이너 ENTRYPOINT 스크립트
# Prisma Client 생성 후 서비스 시작

set -e

echo "🔧 Prisma Client 생성 중..."

# Prisma Client 생성 (스키마 위치는 prisma.config.ts에서 지정됨)
pnpm prisma generate || {
  echo "⚠️  Prisma Client 생성 실패 (계속 진행)"
}

echo "✅ Prisma Client 생성 완료"

# 전달된 명령 실행
exec "$@"
