# GitLab 사용자 가이드

## 개요
이 문서는 GitLab CE 설치 후 초기 설정 및 사용 방법을 안내합니다.

## 1. GitLab 웹 UI 접속

### 접속 정보
- **URL**: http://localhost:8980
- **초기 계정**: `root`
- **초기 비밀번호**: `changeme123!`

### 첫 로그인
1. 브라우저에서 `http://localhost:8980` 접속
2. Username: `root` 입력
3. Password: `changeme123!` 입력
4. **Sign in** 클릭
5. (권장) 첫 로그인 후 비밀번호 변경

## 2. 테스트 프로젝트 생성

### GitLab 웹 UI에서 프로젝트 생성
1. 상단 메뉴에서 **Projects** > **Create new project** 클릭
2. **Create blank project** 선택
3. 프로젝트 정보 입력:
   - **Project name**: `test-project`
   - **Visibility Level**: `Private` 
4. **Create project** 클릭

### 로컬에서 코드 Push
```bash
# 테스트 프로젝트 생성
mkdir test-project
cd test-project
git init

# README 파일 생성
echo "# Test Project" > README.md
git add .
git commit -m "Initial commit"

# GitLab 원격 저장소 추가 (프로젝트 URL 확인 필요)
git remote add origin http://localhost:8980/root/test-project.git

# Push (로그인 정보 입력 필요: root / changeme123!)
git push -u origin main
```

## 3. Container Registry 설정

### Registry 접속 정보
- **Registry URL**: http://localhost:5050
- **프로젝트 Registry**: http://localhost:5050/root/test-project

### Docker 로그인
```bash
# GitLab Container Registry에 로그인
docker login localhost:5050
# Username: root
# Password: changeme123!
```

### 이미지 Push/Pull 테스트
```bash
# 간단한 테스트 이미지 생성
echo 'FROM alpine:latest' > Dockerfile
docker build -t localhost:5050/root/test-project/hello:latest .

# Container Registry에 Push
docker push localhost:5050/root/test-project/hello:latest

# 이미지 Pull 테스트
docker pull localhost:5050/root/test-project/hello:latest
```

### GitLab 웹 UI에서 확인
1. 프로젝트 메뉴에서 **Packages & Registries** > **Container Registry** 클릭
2. Push한 이미지가 표시되는지 확인

## 4. CI/CD Runner 등록

### Runner 설치
```bash
cd /data/all-erp/dev-environment
./scripts/gitlab-runner.sh
```

### Registration Token 확인
1. GitLab 웹 UI에서 **Admin Area** (상단 왼쪽 렌치 아이콘) 클릭
2. 좌측 메뉴에서 **CI/CD** > **Runners** 클릭
3. **Register an instance runner** 섹션에서 **registration token** 복사

### Runner 등록
```bash
# <YOUR_TOKEN>을 위에서 복사한 토큰으로 교체
docker exec -it gitlab-runner gitlab-runner register \
  --non-interactive \
  --url http://all-erp-gitlab:8980 \
  --registration-token <YOUR_TOKEN> \
  --executor docker \
  --description 'ALL-ERP Docker Runner' \
  --docker-image 'node:22-alpine' \
  --docker-network-mode all-erp-network
```

### Runner 등록 확인
```bash
# Runner 목록 확인
docker exec gitlab-runner gitlab-runner list

# GitLab 웹 UI에서도 확인 가능
# Admin Area > CI/CD > Runners에서 등록된 Runner 확인
```

## 5. 간단한 CI/CD 파이프라인 테스트

### .gitlab-ci.yml 작성
테스트 프로젝트에 `.gitlab-ci.yml` 파일을 추가합니다:

```yaml
# .gitlab-ci.yml
stages:
  - test
  - build

hello-job:
  stage: test
  script:
    - echo "Hello, GitLab CI/CD!"
    - node --version
    - npm --version

build-job:
  stage: build
  script:
    - echo "빌드 작업 시작..."
    - echo "빌드 완료!"
```

### 파이프라인 실행
```bash
# .gitlab-ci.yml 파일 추가
git add .gitlab-ci.yml
git commit -m "Add CI/CD pipeline"
git push origin main
```

### 파이프라인 확인
1. GitLab 웹 UI에서 프로젝트 > **Build** > **Pipelines** 클릭
2. 실행 중인 파이프라인 확인
3. 각 Job 클릭하여 로그 확인

## 6. 문제 해결

### GitLab이 응답하지 않을 때
```bash
# GitLab 컨테이너 상태 확인
docker ps -a | grep gitlab

# GitLab 서비스 상태 확인
docker exec all-erp-gitlab gitlab-ctl status

# GitLab 로그 확인
docker logs all-erp-gitlab
```

### Runner가 등록되지 않을 때
```bash
# Runner 컨테이너 상태 확인
docker ps -a | grep gitlab-runner

# Runner 로그 확인
docker logs gitlab-runner

# Runner 네트워크 확인
docker network inspect all-erp-network
```

### Container Registry에 Push할 수 없을 때
```bash
# Docker 로그인 상태 확인
cat ~/.docker/config.json

# Registry 포트 바인딩 확인
docker ps | grep 5050

# 방화벽 확인 (필요 시)
sudo ufw status
```

## 7. 추가 참고 자료
- [GitLab CE 공식 문서](https://docs.gitlab.com/ee/install/docker.html)
- [Container Registry 가이드](https://docs.gitlab.com/ee/user/packages/container_registry/)
- [GitLab CI/CD 가이드](https://docs.gitlab.com/ee/ci/)
