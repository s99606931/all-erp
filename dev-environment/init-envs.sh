#!/bin/bash

# ----------------------------------------------------------------------------
# 스크립트 명: init-envs.sh
# 설명: 프로젝트 전체에서 .env.sample 파일을 찾아 .env 파일로 복사합니다.
#
# 역할:
# 1. 프로젝트 루트를 기준으로 모든 하위 디렉토리를 탐색합니다.
# 2. .env.sample 파일이 존재하지만 .env 파일이 없는 경우 복사합니다.
# 3. node_modules, .git, dist 등 불필요한 디렉토리는 탐색에서 제외합니다.
# 4. 이미 .env 파일이 존재하는 경우 덮어쓰지 않고 건너뜁니다.
#
# 사용법:
# dev-environment/init-envs.sh
#
# 주의사항:
# - 기존에 설정된 .env 파일은 안전하게 보존됩니다.
# - 새로운 서비스를 추가했거나 초기 환경 설정 시 유용합니다.
# ----------------------------------------------------------------------------

# 프로젝트 루트 디렉토리 설정 (스크립트 위치의 상위 디렉토리)
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "🔍 .env.sample 파일을 찾아 .env 생성을 시작합니다..."
echo "기준 경로: $PROJECT_ROOT"

# .env.sample 파일 찾기 (node_modules, .git, dist, volumes 등 제외)
find "$PROJECT_ROOT" \
    \( -path "*/node_modules" -prune \) -o \
    \( -path "*/.git" -prune \) -o \
    \( -path "*/dist" -prune \) -o \
    \( -path "*/volumes" -prune \) -o \
    -type f -name ".env.sample" -print \
    | while read -r sample_file; do
    
    # .env 파일 경로 계산 (.sample 제거)
    env_file="${sample_file%.sample}"
    
    # 해당 디렉토리의 상대 경로 (출력용)
    relative_path="${env_file#$PROJECT_ROOT/}"
    
    if [ ! -f "$env_file" ]; then
        echo "✅ 생성: $relative_path"
        cp "$sample_file" "$env_file"
    else
        echo "⏭️  건너뜀: $relative_path (이미 존재함)"
    fi
done

echo "🎉 모든 작업이 완료되었습니다."
