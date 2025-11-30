# GEMINI 행동 지침 (Gemini Action Guidelines)

이 문서는 Gemini가 사용자와 협업할 때 준수해야 할 언어 및 행동 규칙을 정의합니다.
채팅창에서 출력되는 모든 언어는 한국어로 작성합니다. 
특히 ai가 생성가하는 코드를 한국어로 작성하도록 지시합니다. 
## 1. 언어 원칙 (Language Principles)
*   **기본 언어**: 모든 대화, 문서, 계획, 태스크 리스트는 **한국어(Korean)**를 기본으로 사용합니다.
*   **생각 및 진행 상황**: LLM의 내부 사고 과정(Thought Process), 태스크 상태(Task Status), 진행 요약(Task Summary) 등 사용자에게 노출되는 모든 진행 상황 정보도 **한국어**로 작성합니다.
*   **코드 주석**: 소스 코드 내의 주석(Comment) 또한 **한국어**로 작성하여 가독성을 높입니다.
*   **전문 용어**: IT 전문 용어(예: Intent, View, LLM, RAG 등)는 의미 전달이 명확하도록 영문을 병기하거나, 업계에서 통용되는 영단어를 그대로 사용하되 문맥은 한국어로 자연스럽게 구성합니다.

## 2. 문서 작성 규칙 (Documentation Rules)
*   **Markdown**: 모든 문서는 Markdown 형식을 준수합니다.
*   **파일명**: 파일명은 영문(Snake Case 또는 Pascal Case)을 사용하되, 내용은 한국어로 작성합니다.
*   **구조**: 개요, 상세 내용, 결론(또는 요약)의 구조를 갖추어 논리적으로 작성합니다.
*   **도식화 (Visualization)**: 가이드나 설명 문서에는 이해를 돕기 위해 Mermaid 등을 활용한 도식화 자료를 적극적으로 포함합니다.
*   **Mermaid 주의사항**: Mermaid 다이어그램 작성 시 문법 오류(Parse Error)가 발생하지 않도록 다음 규칙을 엄격히 준수합니다.
    *   **특수문자 처리**: 괄호`()`, `[]`, `{}`, 따옴표`""`, 특수기호 등이 포함된 라벨은 반드시 **큰따옴표**`""`로 감싸야 합니다. (예: `id["라벨(설명)"]`)
    *   **ID 규칙**: 노드 ID에는 공백이나 특수문자를 사용하지 않습니다. (예: `Node_A` (O), `Node A` (X))
    *   **방향 정의**: `flowchart`나 `graph` 사용 시 방향(TB, LR 등)을 명확히 지정합니다.
    *   **Subgraph**: `subgraph` 내부에서도 `direction`을 명시하여 레이아웃 깨짐을 방지합니다.

## 3. 계획 및 태스크 관리 (Planning & Task Management)
*   **task.md**: 진행 중인 작업 목록은 한국어로 관리합니다.
*   **implementation_plan.md**: 구현 계획 수립 시, 목표, 변경 사항, 검증 계획 등을 **반드시 한국어로** 상세히 기술합니다. (영어 작성 금지)
*   **결과 보고서 (Result Document)**:
    *   PRD(`docs/tasks/...`) 기반의 작업이 완료되면, 반드시 `[파일명]_result.md` 형식으로 결과 보고서를 작성합니다.
    *   **필수 포함 항목**: 작업 요약, 수행 내용, 검증 결과
    *   **초급자 배려**: 작업의 효과와 작동 원리를 이해할 수 있도록 **Mermaid 도식화**와 **쉬운 설명(Why This Matters)**을 포함해야 합니다.

## 4. 코드 작성 규칙 (Coding Standards)
*   **변수명/함수명**: 영문으로 작성하되, 의미가 명확해야 합니다.
*   **주석**:
    *   함수/클래스 설명 (Docstring)
    *   복잡한 로직에 대한 라인 주석
    *   **모두 한국어로 작성합니다.**

## 5. AI 작업 시작 전 필수 학습 순서 (AI Learning Path)
프로젝트에 투입되어 작업을 시작하기 전에 다음 순서로 문서를 학습하세요:

1. **`docs/ai/README.md`** 읽기 → 프로젝트 개요 파악
2. **`docs/ai/vibe_coding.md`** 읽기 → AI 페르소나 및 코딩 스타일 숙지
3. **`docs/ai/project_context.md`** 읽기 → 아키텍처 및 기술 스택 이해
4. **`docs/ai/task_workflow.md`** 읽기 → PRD 기반 작업 방법 학습
5. **해당 PRD 문서** 읽고 → 작업 시작!

위 순서대로 학습하면 프로젝트의 핵심 컨텍스트를 빠르게 이해하고 일관성 있는 개발을 진행할 수 있습니다.

## 6. Docker Compose 우선 개발 전략 (Docker-First Strategy)

> ⚠️ **중요**: 모든 개발, 테스트, 운영은 Docker Compose 기반으로 진행합니다.

*   **기본 원칙**:
    *   로컬 호스트에서 서비스를 직접 실행하지 않습니다.
    *   모든 서비스는 Docker 컨테이너 내에서 실행됩니다.
    *   개발 생산성을 위해 볼륨 마운트와 Hot Reload를 사용합니다.

*   **환경별 Docker Compose 파일**:
    *   `docker-compose.dev.yml`: 개발 환경 (볼륨 마운트, Hot Reload)
    *   `docker-compose.test.yml`: 테스트 환경 (격리된 DB, E2E)
    *   `docker-compose.prod.yml`: 운영 환경 (빌드된 이미지)

*   **개발 워크플로우**:
    ```bash
    # 개발 시작
    cd dev-environment
    docker compose -f docker-compose.dev.yml up -d
    
    # 소스 수정 (로컬)
    vim /data/all-erp/apps/auth-service/src/main.ts
    
    # 자동 반영 (볼륨 마운트)
    # Hot Reload로 컨테이너 자동 재시작
    
    # 종료
    docker compose -f docker-compose.dev.yml down
    ```

*   **핵심 장점**:
    *   **일관성**: 로컬, 테스트, 운영 환경 간 차이 최소화
    *   **격리**: OS 환경에 영향받지 않음
    *   **재현성**: "내 컴퓨터에서는 되는데" 문제 원천 차단

*   **참고 문서**: [`docs/guides/docker-compose-workflow.md`](file:///data/all-erp/docs/guides/docker-compose-workflow.md)


---
*이 지침은 2025년 11월 26일부터 적용됩니다.*
