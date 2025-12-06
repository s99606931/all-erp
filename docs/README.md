# All-ERP Developer Knowledge Center

환영합니다! 이 문서는 All-ERP 프로젝트의 개발, 운영, 아키텍처에 대한 모든 지식을 담고 있는 포털입니다.

## 🚀 빠른 시작 (Quick Start)

가장 빈번하게 사용하는 명령어들을 **통합 스크립트(`erp`)**로 단순화했습니다. 복잡한 Docker Compose 명령어를 외울 필요가 없습니다.

### 1. 전체 시스템 실행

```bash
./erp start
```

### 2. 로그 확인

```bash
./erp logs shell       # Shell App 로그
./erp logs auth-service # Auth Service 로그
```

### 3. 시스템 종료

```bash
./erp stop
```

---

## 📚 문서 내비게이션 (Navigation)

### 1. [시스템 아키텍처 (Architecture)](./architecture/)

시스템의 전체적인 설계도와 기술 스택을 설명합니다.

- [마이크로서비스 구조도](./architecture/microservices.md) (예시)
- [DB 스키마](./architecture/database.md) (예시)

### 2. [개발 매뉴얼 (Manuals)](./manuals/)

개발 환경 설정, 배포, 코딩 표준 등 실무 가이드입니다.

- **[프로젝트 관리 가이드](./manuals/project_management_guide.md)**: 프로젝트 구조 및 운영 표준.
- **[AI 코딩 표준](./ai/coding_standards.md)**: AI 기능 개발 시 준수해야 할 규칙.
- **[Docker 구조 가이드](./manuals/DOCKERFILE-GUIDE.md)**: 컨테이너 빌드 원리.

### 3. AI 구현 (Phase 3)

- [AI 프로젝트 컨텍스트](./ai/project_context.md)
- [RAG 구현 가이드](./ai/task_workflow.md)

---

## 🛠 유용한 도구 (Tools)

- **LazyDocker**: 터미널 기반의 컨테이너 모니터링 도구. 설치 후 `lazydocker`를 입력하면 모든 서비스 상태를 GUI로 확인할 수 있습니다.

## 📂 폴더 구조 요약

```
/
├── apps/           # Frontend & Backend Codebase
├── libs/           # Shared Libraries
├── dev-environment/# Docker Compose Infrastructure
├── docs/           # You are here!
└── erp             # Unified CLI Script
```

문서에 대한 문의나 수정 요청은 `docs/manuals`에 이슈를 남겨주세요.
