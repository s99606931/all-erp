#!/bin/bash

##############################################################################
# 단위 테스트 실행 스크립트 (Jest)
# Docker Compose 환경에서 모든 서비스 및 라이브러리의 단위 테스트를 실행합니다.
##############################################################################

set -e  # 오류 발생 시 즉시 종료

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # 색상 초기화

# 프로젝트 루트로 이동
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}🧪 단위 테스트 시작 (Jest)${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Docker 컨테이너가 실행 중인지 확인
CONTAINER_NAME="all-erp-auth-service-dev"
if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo -e "${YELLOW}⚠️  Docker 컨테이너가 실행 중이 아닙니다.${NC}"
    echo -e "${YELLOW}개발 환경을 먼저 시작해주세요:${NC}"
    echo -e "${YELLOW}  cd dev-environment && ./start-dev.sh${NC}"
    echo ""
    echo -e "${BLUE}로컬에서 직접 테스트를 실행합니다...${NC}"
    echo ""
    
    cd "$PROJECT_ROOT"
    
    # 전체 프로젝트에 대해 테스트 실행
    echo -e "${BLUE}🧪 전체 프로젝트 테스트 중...${NC}"
    echo -e "${CYAN}이 작업은 수 분이 걸릴 수 있습니다...${NC}"
    echo ""
    
    if pnpm nx run-many -t test --all --coverage; then
        echo ""
        echo -e "${GREEN}✅ 단위 테스트 성공!${NC}"
        echo -e "${GREEN}========================================${NC}"
        exit 0
    else
        echo ""
        echo -e "${RED}❌ 단위 테스트 실패!${NC}"
        echo -e "${RED}========================================${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ Docker 컨테이너 실행 확인됨${NC}"
    echo ""
    
    # Docker 컨테이너 내에서 테스트 실행
    echo -e "${BLUE}🧪 Docker 컨테이너 내에서 테스트 중...${NC}"
    echo -e "${CYAN}이 작업은 수 분이 걸릴 수 있습니다...${NC}"
    echo ""
    
    # 첫 번째 실행 중인 서비스 컨테이너 찾기
    RUNNING_CONTAINER=$(docker ps --filter "name=all-erp-.*-dev" --format "{{.Names}}" | head -n 1)
    
    if [ -z "$RUNNING_CONTAINER" ]; then
        echo -e "${RED}❌ 실행 중인 서비스 컨테이너를 찾을 수 없습니다.${NC}"
        exit 1
    fi
    
    echo -e "${BLUE}사용 컨테이너: ${RUNNING_CONTAINER}${NC}"
    echo ""
    
    # Docker 컨테이너 내에서 테스트 실행
    if docker exec "$RUNNING_CONTAINER" pnpm nx run-many -t test --all --coverage; then
        echo ""
        echo -e "${GREEN}✅ 단위 테스트 성공!${NC}"
        echo -e "${GREEN}모든 테스트가 정상적으로 통과했습니다.${NC}"
        echo -e "${GREEN}========================================${NC}"
        exit 0
    else
        echo ""
        echo -e "${RED}❌ 단위 테스트 실패!${NC}"
        echo -e "${RED}위 오류를 확인하고 수정해주세요.${NC}"
        echo -e "${RED}========================================${NC}"
        exit 1
    fi
fi
