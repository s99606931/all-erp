# 개발자 코딩 컨벤션 및 가이드 (Human)

## 1. 개요
본 문서는 MSA 기반 ERP 시스템 개발에 참여하는 **모든 개발자**가 준수해야 할 코드 품질 표준, 폴더 구조, 네이밍 규칙을 정의합니다.

## 2. 기술 스택 (Tech Stack)
- **Backend**: NestJS (v11+), TypeScript, Prisma, PostgreSQL
- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS, Zustand
- **Monorepo**: Nx

## 3. 폴더 구조 (Folder Structure)
Nx Monorepo 표준을 따르며, 도메인 주도 설계(DDD)를 지향합니다.

### 3.1 백엔드 (NestJS)
```
src/
├── modules/               # 도메인별 모듈
│   ├── [feature]/
│   │   ├── dto/           # 데이터 전송 객체 (Validation 필수)
│   │   ├── entities/      # DB 엔티티
│   │   ├── [feature].controller.ts
│   │   ├── [feature].service.ts
│   │   └── [feature].module.ts
├── common/                # 전역 공통 모듈 (Guard, Filter, Pipe)
└── main.ts
```

### 3.2 프론트엔드 (Next.js)
```
app/
├── (dashboard)/           # 인증된 사용자용 레이아웃 그룹
│   ├── [feature]/         # 기능별 페이지 라우트
│   │   ├── page.tsx
│   │   └── layout.tsx
├── components/            # 공통 및 기능별 컴포넌트
│   ├── ui/                # 디자인 시스템 기본 컴포넌트 (Button, Input 등)
│   └── [feature]/         # 특정 기능 전용 컴포넌트
├── lib/                   # 유틸리티 함수, 훅, 상수
└── store/                 # 전역 상태 (Zustand)
```

## 4. 코딩 컨벤션 (Coding Convention)

### 4.1 네이밍 규칙 (Naming)
| 구분 | 규칙 | 예시 |
|---|---|---|
| **변수 / 함수** | `camelCase` | `getUserProfile`, `isValid` |
| **클래스 / 인터페이스** | `PascalCase` | `UserService`, `CreateUserDto` |
| **상수** | `UPPER_SNAKE_CASE` | `MAX_RETRY_COUNT` |
| **파일명** | `kebab-case` | `user-profile.component.tsx` |
| **폴더명** | `kebab-case` | `user-management` |

### 4.2 TypeScript 규칙
- **No Any**: `any` 타입 사용을 엄격히 금지합니다. 불확실한 경우 `unknown`을 사용하고 타입 가드를 적용하세요.
- **Interface vs Type**: 객체 정의는 `interface`, 유니온/튜플 등은 `type`을 선호합니다.
- **Strict Mode**: `tsconfig.json`의 `strict: true` 옵션을 항상 유지합니다.

### 4.3 주석 규칙
- **언어**: 모든 주석은 **한국어**로 작성합니다.
- **Docstring**: 공개 메서드나 복잡한 로직의 함수 상단에는 JSDoc 형태의 설명을 추가합니다.
- **TODO**: 추후 작업이 필요한 곳에는 `// TODO: [작업내용]` 형식을 사용합니다.

## 5. Git & Commit
- **Commit Message**: Conventional Commits 규칙을 따릅니다.
    - `feat`: 새로운 기능 추가
    - `fix`: 버그 수정
    - `docs`: 문서 수정
    - `refactor`: 코드 리팩토링 (기능 변경 없음)
    - `chore`: 빌드 태스크, 패키지 매니저 설정 등
- **Branch Strategy**: Git Flow 또는 GitHub Flow를 따릅니다 (main -> develop -> feature/*).
