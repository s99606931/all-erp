# TASK-P6-04: 배포 자동화

## 📋 작업 개요
- **Phase**: Phase 6
- **예상 시간**: 1주
- **우선순위**: High
- **선행 작업**: TASK-P6-03

## 🎯 목표

GitHub Actions를 이용한 CI/CD 파이프라인 구축.

## 📝 상세 작업 내용

### 1. GitHub Actions 워크플로우

**.github/workflows/ci.yml**:
```yaml
name: CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm nx affected:test
      - run: pnpm nx affected:lint

  build:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v3
      - run: pnpm nx affected:build

  deploy:
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    steps:
      - run: echo "Deploy to production"
```

### 2. Docker 이미지 빌드

```yaml
  docker:
    runs-on: ubuntu-latest
    steps:
      - uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: registry.example.com/erp/auth-service:latest
```

### 3. Kubernetes 배포 (Helm)

```yaml
helm upgrade --install auth-service ./charts/auth-service \
  --set image.tag=${{ github.sha }}
```

## ✅ 완료 조건

- [ ] GitHub Actions 워크플로우 작성
- [ ] Docker 이미지 자동 빌드
- [ ] Kubernetes 자동 배포
- [ ] Rollback 전략 수립
- [ ] CI/CD 문서화

## 🔧 실행 명령어

```bash
# 로컬 테스트
act -j test

# Helm 배포
helm install erp ./charts
```
