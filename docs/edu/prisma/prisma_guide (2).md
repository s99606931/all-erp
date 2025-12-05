# Prisma 학습 가이드 - 02. Prisma 아키텍처

## 📖 학습 목표
- Prisma의 전체 구조 이해하기
- 각 컴포넌트의 역할 파악하기
- 데이터 흐름 과정 알아보기

---

## 1. Prisma 전체 아키텍처 개요

Prisma는 여러 레이어로 구성되어 있으며, 각 레이어가 협력하여 타입 안전한 데이터베이스 액세스를 제공합니다.

```mermaid
graph TB
    subgraph "애플리케이션 레이어"
        A["Node.js/TypeScript 코드"]
    end
    
    subgraph "Prisma 레이어"
        B["Prisma Client<br/>자동 생성된 타입 안전 API"]
        C["Prisma Query Engine<br/>쿼리 최적화 & 실행"]
    end
    
    subgraph "데이터 레이어"
        D["데이터베이스<br/>PostgreSQL, MySQL 등"]
    end
    
    A -->|prisma.user.findMany| B
    B -->|최적화된 쿼리| C
    C -->|SQL| D
    D -->|결과| C
    C -->|타입 안전 객체| B
    B -->|"User[]"| A
    

```

### 🎯 각 레이어의 역할

1. **애플리케이션 레이어**: 개발자가 작성하는 비즈니스 로직
2. **Prisma Client**: 타입 안전한 API 제공
3. **Query Engine**: SQL 쿼리 생성 및 최적화
4. **데이터베이스**: 실제 데이터 저장소

---

## 2. Prisma의 핵심 컴포넌트

```mermaid
graph LR
    A[schema.prisma<br/>데이터 모델 정의] --> B[Prisma CLI<br/>명령줄 도구]
    
    B --> C[Prisma Client<br/>Generator]
    B --> D[Prisma Migrate<br/>마이그레이션]
    B --> E[Prisma Studio<br/>GUI 도구]
    
    C --> F[타입 안전 Client<br/>자동 생성]
    D --> G[(Database)]
    E --> G
```

### 📦 1. Prisma Schema (schema.prisma)

**역할**: 데이터베이스 구조를 정의하는 단일 진실 공급원

```prisma
// 이 파일이 모든 것의 시작점입니다!

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  posts Post[]
}

model Post {
  id       Int    @id @default(autoincrement())
  title    String
  authorId Int
  author   User   @relation(fields: [authorId], references: [id])
}
```

### 🔧 2. Prisma CLI

**역할**: 개발 워크플로우를 지원하는 명령줄 도구

```mermaid
graph TD
    A[Prisma CLI] --> B[prisma init<br/>프로젝트 초기화]
    A --> C[prisma generate<br/>Client 생성]
    A --> D[prisma migrate<br/>마이그레이션 관리]
    A --> E[prisma studio<br/>GUI 실행]
    A --> F[prisma db push<br/>스키마 동기화]
    
```

**주요 명령어:**

```bash
# 프로젝트 초기화
prisma init

# Client 생성/재생성
prisma generate

# 마이그레이션 생성 및 적용
prisma migrate dev --name init

# DB GUI 실행
prisma studio

# 스키마를 DB에 바로 적용 (개발 중)
prisma db push
```

### 🎨 3. Prisma Client

**역할**: 타입 안전한 데이터베이스 쿼리 API

```mermaid
sequenceDiagram
    participant Dev as 개발자
    participant Schema as schema.prisma
    participant Gen as Generator
    participant Client as Prisma Client
    participant App as 애플리케이션

    Dev->>Schema: 모델 정의
    Dev->>Gen: prisma generate
    Gen->>Client: 타입 생성
    Client->>App: import { PrismaClient }
    App->>Client: prisma.user.create()
    Client->>App: 타입 안전한 결과 반환
```

**자동 생성되는 내용:**

```typescript
// Prisma가 자동으로 생성하는 타입들

// 1. 모델 타입
type User = {
  id: number
  email: string
}

// 2. 쿼리 메서드
prisma.user.findMany()
prisma.user.create()
prisma.user.update()
prisma.user.delete()

// 3. 관계 포함 타입
type UserWithPosts = User & {
  posts: Post[]
}
```

### 🔄 4. Prisma Migrate

**역할**: 데이터베이스 스키마 버전 관리

```mermaid
graph LR
    A[schema.prisma<br/>변경] --> B[migrate dev]
    B --> C[SQL 마이그레이션<br/>파일 생성]
    C --> D[migrations/<br/>폴더에 저장]
    D --> E[Git에 커밋]
    E --> F[프로덕션 배포]
    F --> G[migrate deploy]
    G --> H[(Database<br/>업데이트)]
    
    style C fill:#4caf50,color:#fff
    style H fill:#2196f3,color:#fff
```

### 🖥️ 5. Prisma Studio

**역할**: 데이터베이스를 시각적으로 관리하는 GUI

```mermaid
graph TB
    A[Prisma Studio] --> B[데이터 조회]
    A --> C[데이터 추가]
    A --> D[데이터 수정]
    A --> E[데이터 삭제]
    A --> F[관계 시각화]
    
    B --> G[(Database)]
    C --> G
    D --> G
    E --> G
    F --> G
    
    style A fill:#9c27b0,color:#fff
```

---

## 3. Query Engine의 동작 원리

Query Engine은 Prisma의 핵심으로, Rust로 작성되어 높은 성능을 제공합니다.

```mermaid
graph TB
    subgraph "애플리케이션"
        A[prisma.user.findMany<br/>include: posts]
    end
    
    subgraph "Query Engine"
        B[1. 쿼리 파싱]
        C[2. 쿼리 최적화]
        D[3. SQL 생성]
        E[4. 배칭 처리]
    end
    
    subgraph "데이터베이스"
        F[SQL 실행]
    end
    
    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    
    style C fill:#4caf50,color:#fff
    style E fill:#ff9800,color:#fff
```

### 🚀 Query Engine의 최적화 기능

#### 1. N+1 쿼리 문제 자동 해결

```mermaid
graph LR
    subgraph "전통적 ORM"
        A1[Users 조회<br/>1번] --> B1[Post 조회<br/>N번]
        B1 --> C1[총 N+1번<br/>쿼리 실행]
    end
    
    subgraph "Prisma Query Engine"
        A2[Users 조회<br/>1번] --> B2[Posts 배치 조회<br/>1번]
        B2 --> C2[총 2번<br/>쿼리 실행]
    end
    
    style C1 fill:#ffcdd2
    style C2 fill:#c8e6c9
```

**예제:**

```typescript
// 이 코드는 딱 2개의 쿼리만 실행됩니다!
const users = await prisma.user.findMany({
  include: { posts: true }
})

// 실행되는 SQL:
// 1. SELECT * FROM users
// 2. SELECT * FROM posts WHERE authorId IN (1, 2, 3, ...)
```

#### 2. 쿼리 배칭 (Batching)

```mermaid
sequenceDiagram
    participant App as 애플리케이션
    participant QE as Query Engine
    participant DB as 데이터베이스

    App->>QE: findUnique({id:1})
    App->>QE: findUnique({id:2})
    App->>QE: findUnique({id:3})
    
    Note over QE: 쿼리들을 모아서<br/>하나로 배칭
    
    QE->>DB: SELECT * FROM users<br/>WHERE id IN (1,2,3)
    DB->>QE: 결과 반환
    QE->>App: 각각 분리하여 반환
```

#### 3. 선택적 관계 로딩 (Selective Relation Loading)

```typescript
// 필요한 데이터만 정확히 가져옵니다
const user = await prisma.user.findUnique({
  where: { id: 1 },
  select: {
    id: true,
    email: true,
    posts: {
      select: {
        title: true,
        // content는 가져오지 않음 (대용량 데이터 절약)
      },
      where: {
        published: true  // 필터링도 가능
      },
      take: 10  // 최대 10개만
    }
  }
})
```

---

## 4. 데이터 흐름 상세 분석

### 📥 쓰기 작업 (Create) 흐름

```mermaid
sequenceDiagram
    participant App as 애플리케이션
    participant PC as Prisma Client
    participant QE as Query Engine
    participant DB as 데이터베이스

    App->>PC: prisma.user.create({...})
    PC->>PC: 타입 검증
    
    alt 타입 오류
        PC-->>App: TypeScript 컴파일 에러
    else 타입 정상
        PC->>QE: 쿼리 요청 전달
        QE->>QE: SQL 생성
        QE->>DB: INSERT INTO users...
        DB->>QE: 생성된 레코드 반환
        QE->>PC: 데이터 변환
        PC->>App: 타입 안전한 객체 반환
    end
```

### 📤 읽기 작업 (Read) 흐름

```mermaid
sequenceDiagram
    participant App as 애플리케이션
    participant PC as Prisma Client
    participant QE as Query Engine
    participant Cache as 쿼리 캐시
    participant DB as 데이터베이스

    App->>PC: prisma.user.findMany({...})
    PC->>QE: 쿼리 요청
    
    QE->>Cache: 캐시 확인
    
    alt 캐시 히트
        Cache-->>QE: 캐시된 결과
    else 캐시 미스
        QE->>DB: SELECT * FROM users...
        DB->>QE: 결과 반환
        QE->>Cache: 결과 캐싱
    end
    
    QE->>PC: 데이터 반환
    PC->>App: 타입 안전한 배열 반환
```

---

## 5. 프로젝트 구조와 파일 역할

```mermaid
graph TB
    subgraph "프로젝트 루트"
        A[package.json]
        B[.env]
        
        subgraph "prisma/"
            C[schema.prisma<br/>데이터 모델]
            
            subgraph "migrations/"
                D[20240101_init/<br/>마이그레이션 히스토리]
            end
        end
        
        subgraph "node_modules/"
            E[@prisma/client<br/>생성된 Client]
            F[.prisma/client<br/>생성된 타입]
        end
        
        subgraph "src/"
            G[app.ts<br/>애플리케이션 코드]
        end
    end
    
    C -->|prisma generate| E
    C -->|prisma generate| F
    G -->|import| E
    B -->|DATABASE_URL| C
    
    style C fill:#4caf50,color:#fff
    style E fill:#2196f3,color:#fff
```

### 📁 각 파일의 역할

```plaintext
my-project/
├── prisma/
│   ├── schema.prisma        # 👑 가장 중요! 데이터 모델 정의
│   └── migrations/          # 📜 마이그레이션 히스토리
│       └── 20240101_init/
│           └── migration.sql
│
├── node_modules/
│   ├── @prisma/client/      # 📦 Prisma Client 패키지
│   └── .prisma/             # 🤖 자동 생성된 코드
│       └── client/
│           ├── index.d.ts   # TypeScript 타입 정의
│           └── index.js     # 실행 가능한 JS 코드
│
├── src/
│   ├── index.ts             # 🚀 애플리케이션 진입점
│   └── prisma.ts            # 🔧 Prisma Client 인스턴스
│
├── .env                     # 🔐 환경 변수 (DB URL 등)
├── package.json             # 📋 프로젝트 설정
└── tsconfig.json           # ⚙️ TypeScript 설정
```

---

## 6. Prisma Client 생성 과정

```mermaid
graph TD
    A["schema.prisma 작성"] --> B{"prisma generate 실행"}
    
    B --> C[1. Schema 파싱]
    C --> D[2. 모델 분석]
    D --> E[3. TypeScript 타입 생성]
    E --> F[4. 쿼리 메서드 생성]
    F --> G[5. node_modules에 저장]
    
    G --> H[✅ 사용 가능!]
    
    H --> I["import { PrismaClient }"]
    
    style B fill:#2196f3,color:#fff
    style H fill:#2196f3,color:#fff
```

### 🔄 언제 재생성이 필요한가?

```mermaid
graph LR
    A[schema.prisma 수정] --> B{어떤 변경?}
    
    B -->|모델 추가/수정| C[prisma generate 필수]
    B -->|필드 추가/수정| C
    B -->|관계 변경| C
    B -->|주석만 수정| D[generate 불필요]
    
    C --> E[Client 재생성]
    
    style C fill:#f44336,color:#fff
    style D fill:#4caf50,color:#fff
```

---

## 7. 실제 동작 예제

### 📝 사용자 생성 전체 흐름

```mermaid
sequenceDiagram
    autonumber
    participant Dev as 개발자
    participant IDE as VS Code
    participant App as app.ts
    participant PC as Prisma Client
    participant QE as Query Engine
    participant PG as PostgreSQL

    Dev->>IDE: 코드 작성
    IDE->>Dev: 자동완성 제공
    
    Dev->>App: npm start
    App->>PC: prisma.user.create({<br/>email: "test@example.com"<br/>})
    
    PC->>PC: 타입 검증 ✅
    PC->>QE: 쿼리 요청 전달
    
    QE->>QE: SQL 생성<br/>INSERT INTO users...
    QE->>PG: SQL 실행
    
    PG->>PG: 데이터 저장
    PG->>QE: id: 1 반환
    
    QE->>PC: 결과 매핑
    PC->>App: { id: 1, email: "..." }
    App->>Dev: 콘솔 출력
```

### 💡 실제 코드

```typescript
// 1. Prisma Client import
import { PrismaClient } from '@prisma/client'

// 2. 인스턴스 생성
const prisma = new PrismaClient()

// 3. 사용자 생성 (완전한 타입 안전성!)
async function main() {
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      name: 'Test User'
    }
  })
  
  console.log(user)  // { id: 1, email: '...', name: '...' }
}

main()
```

---

## 8. 성능 고려사항

### ⚡ Connection Pooling

```mermaid
graph TB
    subgraph "애플리케이션 인스턴스들"
        A1[App 1]
        A2[App 2]
        A3[App 3]
    end
    
    subgraph "Prisma Connection Pool"
        B[Connection Pool<br/>최대 10개 연결]
    end
    
    subgraph "데이터베이스"
        C[(PostgreSQL)]
    end
    
    A1 -->|쿼리 요청| B
    A2 -->|쿼리 요청| B
    A3 -->|쿼리 요청| B
    
    B <-->|재사용 가능한 연결| C
    
    style B fill:#4caf50,color:#fff
```

**설정 방법:**

```bash
# .env 파일
DATABASE_URL="postgresql://user:password@localhost:5432/mydb?connection_limit=10&pool_timeout=20"
```

### 🎯 Query Engine 최적화

```mermaid
graph LR
    A[여러 쿼리 요청] --> B[Query Engine]
    
    B --> C[배칭]
    B --> D[캐싱]
    B --> E[조인 최적화]
    
    C --> F[효율적 실행]
    D --> F
    E --> F
    
    style B fill:#2196f3,color:#fff
    style F fill:#4caf50,color:#fff
```

---

## 9. 디버깅 및 로깅

### 🔍 쿼리 로그 활성화

```typescript
const prisma = new PrismaClient({
  log: [
    { level: 'query', emit: 'event' },
    { level: 'error', emit: 'stdout' },
    { level: 'info', emit: 'stdout' },
    { level: 'warn', emit: 'stdout' },
  ],
})

// 쿼리 로그 리스너
prisma.$on('query', (e) => {
  console.log('Query: ' + e.query)
  console.log('Duration: ' + e.duration + 'ms')
})
```

**출력 예:**

```
Query: SELECT "User"."id", "User"."email" FROM "User" WHERE 1=1
Duration: 12ms
```

---

## 🎯 요약

### Prisma 아키텍처의 핵심

```mermaid
mindmap
  root((Prisma<br/>아키텍처))
    Schema
      단일 진실 공급원
      선언적 정의
    Client
      자동 생성
      타입 안전
    Query Engine
      쿼리 최적화
      배칭 처리
    Migration
      버전 관리
      안전한 변경
```

### 중요 포인트

1. **Schema가 모든 것의 중심**: 하나의 파일로 전체 정의
2. **자동 생성의 마법**: 타입과 API가 자동 생성
3. **성능 최적화**: Query Engine이 알아서 처리
4. **안전한 변경**: Migration으로 이력 관리

---

## 💡 실전 팁

> **개발 워크플로우:**
> 1. `schema.prisma` 수정
> 2. `prisma generate` 실행 (Client 재생성)
> 3. `prisma migrate dev` 실행 (DB 업데이트)
> 4. 코드에서 타입 안전하게 사용!
>
> 이 4단계만 기억하면 됩니다!

---

**다음 장: [03. 기본 설정 및 시작하기](./03-setup.md)**
