# Prisma 학습 가이드 - 03. 기본 설정 및 시작하기

## 📖 학습 목표
- Prisma 프로젝트 처음부터 설정하기
- 데이터베이스 연결 구성하기
- 첫 번째 모델 생성 및 마이그레이션 실행하기

---

## 1. 프로젝트 초기 설정

### 🚀 Step 1: Node.js 프로젝트 생성

```bash
# 새 디렉토리 생성
mkdir my-prisma-project
cd my-prisma-project

# package.json 생성
npm init -y

# TypeScript 설정
npm install typescript ts-node @types/node --save-dev
npx tsc --init
```

### 📦 Step 2: Prisma 설치

```bash
# Prisma CLI 설치 (개발 의존성)
npm install prisma --save-dev

# Prisma Client 설치 (런타임 의존성)
npm install @prisma/client
```

```mermaid
graph LR
    A[npm install prisma] --> B[개발 도구]
    C[npm install @prisma/client] --> D[런타임 라이브러리]
    
    B --> E[CLI 명령어<br/>사용 가능]
    D --> F[코드에서<br/>import 가능]
    
    style B fill:#ff9800,color:#fff
    style D fill:#2196f3,color:#fff
```

### ⚙️ Step 3: Prisma 초기화

```bash
npx prisma init
```

**실행 결과:**

```mermaid
graph TD
    A[prisma init 실행] --> B[prisma/ 폴더 생성]
    A --> C[.env 파일 생성]
    
    B --> D[schema.prisma<br/>기본 템플릿]
    C --> E[DATABASE_URL<br/>환경 변수]
    
    style A fill:#4caf50,color:#fff
```

**생성되는 파일 구조:**

```plaintext
my-prisma-project/
├── prisma/
│   └── schema.prisma       # 👈 여기에 모델 정의
├── .env                    # 👈 데이터베이스 URL
├── node_modules/
├── package.json
└── tsconfig.json
```

---

## 2. 데이터베이스 연결 설정

### 🔌 데이터베이스 선택

Prisma는 다양한 데이터베이스를 지원합니다:

```mermaid
graph TB
    A[Prisma] --> B[PostgreSQL<br/>👍 권장]
    A --> C[MySQL/MariaDB]
    A --> D[SQLite<br/>💡 테스트용]
    A --> E[SQL Server]
    A --> F[MongoDB]
    A --> G[CockroachDB]
    
    style B fill:#4caf50,color:#fff
    style D fill:#2196f3,color:#fff
```

### 📝 PostgreSQL 설정 (권장)

**.env 파일:**

```bash
# PostgreSQL 연결 문자열
DATABASE_URL="postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE?schema=public"

# 실제 예시
DATABASE_URL="postgresql://johndoe:password123@localhost:5432/mydb?schema=public"
```

**schema.prisma 파일:**

```prisma
datasource db {
  provider = "postgresql"  // 사용할 데이터베이스
  url      = env("DATABASE_URL")  // .env 파일에서 가져오기
}

generator client {
  provider = "prisma-client-js"
}
```

### 🗄️ 다른 데이터베이스 설정

#### MySQL 설정

```bash
# .env
DATABASE_URL="mysql://root:password@localhost:3306/mydb"
```

```prisma
// schema.prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

#### SQLite 설정 (로컬 개발용)

```bash
# .env
DATABASE_URL="file:./dev.db"
```

```prisma
// schema.prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

### 🔍 연결 문자열 구조

```mermaid
graph LR
    A["postgresql://"] --> B[username:password]
    B --> C["@host:port"]
    C --> D["/database"]
    D --> E["?옵션들"]
    
    E --> F[schema=public]
    E --> G[connection_limit=10]
    E --> H[pool_timeout=20]
```

**전체 예시:**

```
postgresql://user:pass@localhost:5432/mydb?schema=public&connection_limit=10
│         │   │    │    │        │    │     │                         │
프로토콜   유저 비번 호스트 포트 DB명  스키마 연결풀 설정
```

---

## 3. 첫 번째 모델 생성

### 📋 간단한 사용자 모델

**schema.prisma 파일 수정:**

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// 👇 첫 번째 모델 정의
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### 🎯 모델 구조 이해하기

```mermaid
graph TD
    A[User 모델] --> B[id: Int<br/>기본 키]
    A --> C[email: String<br/>고유값]
    A --> D[name: String?<br/>선택적]
    A --> E[createdAt: DateTime<br/>자동 생성]
    A --> F[updatedAt: DateTime<br/>자동 업데이트]
    
    B --> G["@id: 기본 키 지정"]
    B --> H["@default: 자동 증가"]
    C --> I["@unique: 중복 불가"]
    E --> J["@default: 현재 시간"]
    F --> K["@updatedAt: 자동 갱신"]
    
    style A fill:#4caf50,color:#fff
```

**각 속성 설명:**

| 속성 | 의미 | 예시 |
|------|------|------|
| `@id` | 기본 키 (Primary Key) | `id Int @id` |
| `@default(autoincrement())` | 자동 증가 | 1, 2, 3, ... |
| `@unique` | 고유값 (중복 불가) | 이메일, 사용자명 |
| `?` | 선택적 필드 (NULL 허용) | `name String?` |
| `@default(now())` | 생성 시 현재 시간 | `createdAt` |
| `@updatedAt` | 수정 시 자동 갱신 | `updatedAt` |

---

## 4. 마이그레이션 실행

### 🔄 마이그레이션 프로세스

```mermaid
sequenceDiagram
    participant Dev as 개발자
    participant Schema as schema.prisma
    participant CLI as Prisma CLI
    participant DB as 데이터베이스

    Dev->>Schema: 모델 작성
    Dev->>CLI: prisma migrate dev
    CLI->>CLI: 변경사항 분석
    CLI->>CLI: SQL 생성
    CLI->>Dev: 마이그레이션 이름 입력 요청
    Dev->>CLI: "init" 입력
    CLI->>DB: SQL 실행
    DB->>CLI: 테이블 생성 완료
    CLI->>Dev: ✅ 마이그레이션 성공
```

### 🚀 첫 마이그레이션 실행

```bash
npx prisma migrate dev --name init
```

**실행 과정:**

```mermaid
graph TB
    A[prisma migrate dev] --> B{변경사항 감지}
    
    B -->|있음| C[SQL 파일 생성]
    C --> D[migrations/20240101_init/<br/>migration.sql]
    D --> E[데이터베이스에 적용]
    E --> F[Prisma Client 재생성]
    F --> G[✅ 완료]
    
    B -->|없음| H[⚠️ 변경사항 없음]
    
    style G fill:#4caf50,color:#fff
```

**생성되는 파일:**

```plaintext
prisma/
├── schema.prisma
└── migrations/
    └── 20240101000000_init/
        └── migration.sql       # 👈 생성된 SQL
```

**migration.sql 내용:**

```sql
-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
```

---

## 5. Prisma Client 생성 및 사용

### 🔧 Client 생성

```bash
npx prisma generate
```

```mermaid
graph LR
    A[schema.prisma] -->|prisma generate| B[TypeScript 타입 생성]
    B --> C["node_modules/<br/>@prisma/client"]
    C --> D[코드에서 사용 가능]
    
    style B fill:#2196f3,color:#fff
    style D fill:#4caf50,color:#fff
```

### 💻 Prisma Client 사용하기

**src/index.ts 파일 생성:**

```typescript
import { PrismaClient } from '@prisma/client'

// Prisma Client 인스턴스 생성
const prisma = new PrismaClient()

async function main() {
  // 사용자 생성
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      name: 'Test User'
    }
  })
  
  console.log('생성된 사용자:', user)
  
  // 모든 사용자 조회
  const allUsers = await prisma.user.findMany()
  console.log('전체 사용자:', allUsers)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

### ▶️ 실행하기

```bash
npx ts-node src/index.ts
```

**출력 결과:**

```
생성된 사용자: {
  id: 1,
  email: 'test@example.com',
  name: 'Test User',
  createdAt: 2024-01-01T00:00:00.000Z,
  updatedAt: 2024-01-01T00:00:00.000Z
}
```

---

## 6. 프로젝트 구조 완성

### 📁 권장 프로젝트 구조

```plaintext
my-prisma-project/
├── prisma/
│   ├── schema.prisma           # 데이터 모델 정의
│   └── migrations/             # 마이그레이션 히스토리
│       └── 20240101_init/
│           └── migration.sql
│
├── src/
│   ├── index.ts               # 메인 파일
│   ├── prisma.ts              # Prisma Client 싱글톤
│   └── services/              # 비즈니스 로직
│       └── user.service.ts
│
├── .env                       # 환경 변수 (비밀번호 등)
├── .gitignore                # Git 제외 파일
├── package.json
└── tsconfig.json
```

### 🔒 Prisma Client 싱글톤 패턴

**src/prisma.ts:**

```typescript
import { PrismaClient } from '@prisma/client'

// 싱글톤 패턴으로 하나의 인스턴스만 생성
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ['query', 'error', 'warn'],  // 로그 설정
  })
}

// 전역 타입 정의
declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

// 인스턴스 생성 또는 재사용
const prisma = globalThis.prisma ?? prismaClientSingleton()

// 개발 환경에서는 전역 변수에 저장
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma
}

export default prisma
```

```mermaid
graph TD
    A[첫 번째 import] --> B{전역 prisma 존재?}
    B -->|없음| C[새 인스턴스 생성]
    B -->|있음| D[기존 인스턴스 재사용]
    
    C --> E[전역 변수에 저장]
    D --> F[반환]
    E --> F
    
    style C fill:#4caf50,color:#fff
    style D fill:#2196f3,color:#fff
```

**왜 싱글톤을 사용하나요?**

1. **연결 풀 효율성**: 하나의 연결 풀만 사용
2. **메모리 절약**: 중복 인스턴스 방지
3. **Hot Reload 대응**: 개발 중 재시작 시에도 안전

---

## 7. 환경 변수 관리

### 🔐 .env 파일 구조

```bash
# 데이터베이스 연결
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"

# 애플리케이션 설정
NODE_ENV="development"
PORT=3000

# 보안 키
JWT_SECRET="your-secret-key"
```

### ⚠️ .gitignore 설정

**.gitignore 파일:**

```
# 환경 변수 (중요!)
.env
.env.*

# Node
node_modules/
dist/

# Prisma
prisma/dev.db
prisma/dev.db-journal
```

```mermaid
graph LR
    A[.env] -->|절대 커밋하지 말 것!| B[Git]
    C[.env.example] -->|템플릿으로 커밋| B
    
    style A fill:#f44336,color:#fff
    style C fill:#4caf50,color:#fff
```

### 📋 .env.example 생성

```bash
# .env.example (팀원들을 위한 템플릿)
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
NODE_ENV="development"
PORT=3000
JWT_SECRET="change-this-in-production"
```

---

## 8. 유용한 Prisma CLI 명령어

### 📚 자주 사용하는 명령어

```mermaid
graph TB
    A[Prisma CLI] --> B[prisma init<br/>프로젝트 초기화]
    A --> C[prisma generate<br/>Client 생성]
    A --> D[prisma migrate dev<br/>개발 마이그레이션]
    A --> E[prisma migrate deploy<br/>프로덕션 배포]
    A --> F[prisma studio<br/>GUI 실행]
    A --> G[prisma db push<br/>스키마 동기화]
    A --> H[prisma db pull<br/>DB에서 스키마 가져오기]
    
    style B fill:#4caf50,color:#fff
    style C fill:#2196f3,color:#fff
    style D fill:#ff9800,color:#fff
```

### 🛠️ 명령어 상세 설명

```bash
# 1. 초기화
prisma init

# 2. Client 생성
prisma generate

# 3. 마이그레이션 (개발)
prisma migrate dev --name 변경내용

# 4. 마이그레이션 (프로덕션)
prisma migrate deploy

# 5. 스키마 즉시 반영 (마이그레이션 없이)
prisma db push

# 6. 기존 DB에서 스키마 가져오기
prisma db pull

# 7. GUI 도구 실행
prisma studio

# 8. 마이그레이션 상태 확인
prisma migrate status

# 9. 스키마 포맷팅
prisma format

# 10. 스키마 검증
prisma validate
```

---

## 9. 개발 워크플로우

### 🔄 일반적인 개발 사이클

```mermaid
sequenceDiagram
    autonumber
    participant Dev as 개발자
    participant Schema as schema.prisma
    participant CLI as Prisma CLI
    participant Code as 코드

    Dev->>Schema: 모델 수정
    Dev->>CLI: prisma migrate dev
    CLI->>CLI: 마이그레이션 생성
    CLI->>CLI: DB 업데이트
    CLI->>CLI: Client 재생성
    
    Dev->>Code: 코드 작성
    Code->>Dev: 자동완성 제공
    Dev->>Code: npm run dev
    Code->>Dev: 애플리케이션 실행
```

### ⚡ 빠른 프로토타이핑 워크플로우

```mermaid
graph LR
    A[schema.prisma 수정] --> B[prisma db push]
    B --> C[즉시 DB 반영]
    C --> D[코드 테스트]
    D --> E{만족?}
    E -->|아니오| A
    E -->|예| F[prisma migrate dev<br/>마이그레이션 생성]
    
    style B fill:#ff9800,color:#fff
    style F fill:#4caf50,color:#fff
```

**언제 무엇을 사용하나요?**

| 상황 | 명령어 | 설명 |
|------|--------|------|
| **빠른 실험** | `prisma db push` | 마이그레이션 없이 즉시 반영 |
| **정식 개발** | `prisma migrate dev` | 마이그레이션 생성 및 이력 관리 |
| **프로덕션 배포** | `prisma migrate deploy` | 마이그레이션만 적용 |

---

## 10. 트러블슈팅

### ❌ 자주 발생하는 에러

#### 1. 데이터베이스 연결 실패

```
Error: Can't reach database server at `localhost:5432`
```

**해결 방법:**

```mermaid
graph TD
    A[연결 에러] --> B{PostgreSQL 실행 중?}
    B -->|아니오| C[PostgreSQL 시작]
    B -->|예| D{포트 번호 확인}
    D -->|틀림| E[.env 파일 수정]
    D -->|맞음| F{비밀번호 확인}
    F -->|틀림| G[DATABASE_URL 수정]
    
    style C fill:#4caf50,color:#fff
    style E fill:#4caf50,color:#fff
    style G fill:#4caf50,color:#fff
```

#### 2. Prisma Client 타입 오류

```
Cannot find module '@prisma/client'
```

**해결:**

```bash
# Client 재생성
npx prisma generate

# node_modules 재설치
rm -rf node_modules
npm install
```

#### 3. 마이그레이션 충돌

```
Error: Database schema is not in sync
```

**해결:**

```bash
# 개발 환경: 리셋
npx prisma migrate reset

# 프로덕션: 마이그레이션 상태 확인
npx prisma migrate status
npx prisma migrate resolve
```

---

## 🎯 요약

### 설정 체크리스트

```mermaid
graph TD
    A[✅ Node.js 설치] --> B[✅ 프로젝트 초기화]
    B --> C[✅ Prisma 설치]
    C --> D[✅ prisma init]
    D --> E[✅ DATABASE_URL 설정]
    E --> F[✅ 모델 정의]
    F --> G[✅ prisma migrate dev]
    G --> H[✅ 코드 작성]
    H --> I[✅ 실행]
    
    style I fill:#4caf50,color:#fff
```

### 핵심 명령어 3가지

```bash
# 1. 마이그레이션 생성 및 적용
npx prisma migrate dev --name init

# 2. Client 재생성
npx prisma generate

# 3. GUI 도구 실행
npx prisma studio
```

---

## 💡 다음 단계

이제 기본 설정이 완료되었습니다! 다음 장에서는:
- Schema 문법을 자세히 배우고
- 다양한 데이터 타입과 속성을 사용하고
- 복잡한 모델을 정의하는 방법

을 학습하겠습니다.

---

**다음 장: [04. Prisma Schema 기초](./04-schema-basics.md)**
