#!/bin/bash
# GitLab Runner 설치 및 등록 스크립트
# 
# 사용법:
#   1. 이 스크립트를 실행하여 GitLab Runner 컨테이너를 시작합니다.
#   2. GitLab 웹 UI에서 Registration Token을 확인합니다.
#   3. 스크립트 출력에 표시된 명령어로 Runner를 등록합니다.

set -e

echo "========================================="
echo "GitLab Runner 설치 스크립트"
echo "========================================="
echo ""

# GitLab Runner 컨테이너 실행
echo "📦 GitLab Runner 컨테이너를 시작합니다..."
docker run -d --name gitlab-runner --restart always \
  --network all-erp-network \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v gitlab-runner-config:/etc/gitlab-runner \
  gitlab/gitlab-runner:latest

echo "✅ GitLab Runner 컨테이너가 시작되었습니다."
echo ""

# Runner 등록 안내
echo "========================================="
echo "다음 단계: GitLab Runner 등록"
echo "========================================="
echo ""
echo "1️⃣  GitLab 웹 UI에 접속하세요:"
echo "    http://localhost:8980"
echo ""
echo "2️⃣  Admin Area > CI/CD > Runners 메뉴로 이동하여 Registration Token을 확인하세요."
echo ""
echo "3️⃣  아래 명령어로 Runner를 등록하세요 (<YOUR_TOKEN>을 실제 토큰으로 교체):"
echo ""
echo "    docker exec -it gitlab-runner gitlab-runner register \\"
echo "      --non-interactive \\"
echo "      --url http://all-erp-gitlab:8980 \\"
echo "      --registration-token <YOUR_TOKEN> \\"
echo "      --executor docker \\"
echo "      --description 'ALL-ERP Docker Runner' \\"
echo "      --docker-image 'node:22-alpine' \\"
echo "      --docker-volumes /var/run/docker.sock:/var/run/docker.sock \\"
echo "      --docker-network-mode all-erp-network"
echo ""
echo "========================================="
echo ""
echo "💡 TIP: GitLab Runner 컨테이너 로그 확인:"
echo "    docker logs -f gitlab-runner"
echo ""
echo "💡 TIP: Runner 상태 확인:"
echo "    docker exec gitlab-runner gitlab-runner list"
echo ""
