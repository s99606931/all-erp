#!/bin/bash

##############################################################################
# 통합 검사 스크립트 (문법 + 빌드 + 테스트)
# 모든 검사를 순차적으로 실행하여 코드 품질을 보장합니다.
##############################################################################

set -e  # 오류 발생 시 즉시 종료

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # 색상 초기화

# 프로젝트 루트로 이동
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo -e "${MAGENTA}╔════════════════════════════════════════╗${NC}"
echo -e "${MAGENTA}║   통합 코드 품질 검사 (All Checks)    ║${NC}"
echo -e "${MAGENTA}╚════════════════════════════════════════╝${NC}"
echo ""

# 총 시작 시간
START_TIME=$(date +%s)

# 1. 문법 검사
echo -e "${BLUE}[1/3] 문법 검사 시작...${NC}"
echo ""
if bash "$SCRIPT_DIR/check-lint.sh"; then
    LINT_TIME=$(date +%s)
    LINT_DURATION=$((LINT_TIME - START_TIME))
    echo ""
    echo -e "${GREEN}✅ 문법 검사 완료 (${LINT_DURATION}초)${NC}"
    echo ""
else
    echo ""
    echo -e "${RED}❌ 문법 검사 실패!${NC}"
    echo -e "${RED}통합 검사를 중단합니다.${NC}"
    exit 1
fi

# 2. 빌드 검사
echo -e "${BLUE}[2/3] 빌드 검사 시작...${NC}"
echo ""
if bash "$SCRIPT_DIR/check-build.sh"; then
    BUILD_TIME=$(date +%s)
    BUILD_DURATION=$((BUILD_TIME - LINT_TIME))
    echo ""
    echo -e "${GREEN}✅ 빌드 검사 완료 (${BUILD_DURATION}초)${NC}"
    echo ""
else
    echo ""
    echo -e "${RED}❌ 빌드 검사 실패!${NC}"
    echo -e "${RED}통합 검사를 중단합니다.${NC}"
    exit 1
fi

# 3. 단위 테스트 (선택적)
echo -e "${BLUE}[3/3] 단위 테스트 시작...${NC}"
echo ""
if bash "$SCRIPT_DIR/check-test.sh"; then
    TEST_TIME=$(date +%s)
    TEST_DURATION=$((TEST_TIME - BUILD_TIME))
    echo ""
    echo -e "${GREEN}✅ 단위 테스트 완료 (${TEST_DURATION}초)${NC}"
    echo ""
else
    echo ""
    echo -e "${RED}❌ 단위 테스트 실패!${NC}"
    echo -e "${RED}통합 검사를 중단합니다.${NC}"
    exit 1
fi

# 최종 결과
END_TIME=$(date +%s)
TOTAL_DURATION=$((END_TIME - START_TIME))

echo ""
echo -e "${MAGENTA}╔════════════════════════════════════════╗${NC}"
echo -e "${MAGENTA}║          검사 결과 요약                ║${NC}"
echo -e "${MAGENTA}╚════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}✅ 문법 검사: 성공 (${LINT_DURATION}초)${NC}"
echo -e "${GREEN}✅ 빌드 검사: 성공 (${BUILD_DURATION}초)${NC}"
echo -e "${GREEN}✅ 단위 테스트: 성공 (${TEST_DURATION}초)${NC}"
echo ""
echo -e "${CYAN}총 소요 시간: ${TOTAL_DURATION}초${NC}"
echo ""
echo -e "${GREEN}🎉 모든 검사를 성공적으로 통과했습니다!${NC}"
echo -e "${MAGENTA}════════════════════════════════════════${NC}"
