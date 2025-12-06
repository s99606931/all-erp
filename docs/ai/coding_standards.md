# AI Development Guidelines (AI 개발 표준 가이드)

## 1. 개요

본 문서는 `ai-service` 및 관련 AI 기능을 개발할 때 준수해야 할 코딩 표준과 아키텍처 원칙을 정의합니다. 모든 AI 개발자는 이 가이드를 따라 코드의 일관성과 유지보수성을 확보해야 합니다.

## 2. 기술 스택 원칙

- **Framework**: [NestJS](https://nestjs.com/) (Module 기반 아키텍처 준수).
- **LLM Orchestration**: [LangChain.js](https://js.langchain.com/) (v0.2+).
- **Structure**: `Runnable` (Chain) 패턴보다는 명시적인 서비스 메서드 호출을 선호합니다 (디버깅 용이성).
  - _Good_: `const prompt = ...; const res = await model.invoke(prompt);`
  - _Avoid_: 복잡하게 중첩된 `RunnableSequence` (필요한 경우에만 사용).

## 3. 아키텍처 & 폴더 구조

AI 기능은 `apps/ai/ai-service/src/app/ai` 하위에 위치하며, 역할에 따라 명확히 분리합니다.

```
src/app/ai/
├── ai.controller.ts       # API Endpoints (Swagger Decorators 필수)
├── ai.module.ts           # 의존성 등록
├── llm.service.ts         # LLM Provider 추상화 (Google/OpenAI 전환 로직)
├── rag.service.ts         # RAG 비즈니스 로직 (Search + Augment + Generate)
├── vector-store.service.ts# Vector DB 접근 계층 (Milvus)
└── prompts/               # [권장] 긴 프롬프트는 별도 파일/상수로 분리
    └── index.ts
```

## 4. 코딩 표준 (Coding Standards)

### 4.1. LLM Service Abstraction

LLM 모델을 직접 Controller에서 호출하지 마십시오. 반드시 `LlmService`를 통해 호출해야 하며, 이를 통해 Provider(`google` vs `openai`) 유연성을 유지해야 합니다.

```typescript
// ✅ Good
const response = await this.llmService.chat(userPrompt, systemPrompt);

// ❌ Bad
const model = new ChatOpenAI({ ... });
const response = await model.invoke(userPrompt);
```

### 4.2. Prompt Management

시스템 프롬프트나 복잡한 지시사항은 코드 내에 하드코딩하지 말고, `prompts` 폴더나 상수로 관리하여 버전 관리가 용이하게 합니다.

```typescript
// src/app/ai/prompts/rag.prompt.ts
export const RAG_SYSTEM_PROMPT = `
You are a helpful assistant.
Context: {context}
...
`;
```

### 4.3. Type Safety

LangChain의 `Document` 타입이나 LLM 응답 타입을 명시적으로 사용하십시오. `any` 사용을 지양합니다.

### 4.4. Error Handling

LLM 호출은 실패할 가능성이 높습니다 (Timeout, Rate Limit). 서비스 계층에서 적절한 예외 처리(Try-Catch)를 수행하고, 사용자에게는 친절한 피드백을 주어야 합니다.

```typescript
try {
  return await this.llmService.chat(prompt);
} catch (error) {
  this.logger.error('LLM Error', error);
  throw new ServiceUnavailableException('AI 모델이 응답하지 않습니다.');
}
```

## 5. RAG Pipeline 표준

1.  **Chunking**: `RecursiveCharacterTextSplitter` 사용을 표준으로 함 (Chunk Size: 1000, Overlap: 200).
2.  **Embedding**: `text-embedding-004` (Google) 또는 `text-embedding-3-small` (OpenAI) 사용.
3.  **Vector Store**: Milvus Collection 이름은 `all_erp_{domain}` 규칙을 따름 (예: `all_erp_rag`).

## 6. 테스트 (Testing)

- **Unit Test**: `LlmService`를 Mocking하여 비즈니스 로직 테스트.
- **Integration Test**: 실제 LLM 호출은 비용이 발생하므로, 개발 단계에서는 Mock 응답을 활용하거나 `.env`의 `LLM_MOCK=true` 플래그(구현 권장)를 사용.
