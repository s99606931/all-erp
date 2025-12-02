#!/bin/bash
# 로컬 CI 체크 스크립트
# 변경된 파일에 대해 Lint 및 Test를 수행합니다.

set -e

echo "🔍 CI Check 시작..."

# Base 브랜치 설정 (기본값: origin/main)
BASE=${1:-origin/main}
HEAD=${2:-HEAD}

echo "Target Base: $BASE"
echo "Target Head: $HEAD"

# 1. Lint
echo "Running Lint..."
pnpm nx affected:lint --base=$BASE --head=$HEAD --parallel=3

# 2. Test
echo "Running Test..."
pnpm nx affected:test --base=$BASE --head=$HEAD --parallel=3

echo "✅ CI Check 완료!"
