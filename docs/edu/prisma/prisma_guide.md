# Prisma 완전 학습 가이드 (마이크로서비스 중심)

## 목차
1. [Prisma 소개](#1-prisma-소개)
2. [Prisma 아키텍처](#2-prisma-아키텍처)
3. [기본 설정 및 시작하기](#3-기본-설정-및-시작하기)
4. [Prisma Schema 기초](#4-prisma-schema-기초)
5. [CRUD 작업](#5-crud-작업)
6. [관계형 데이터 모델링](#6-관계형-데이터-모델링)
7. [고급 쿼리 기법](#7-고급-쿼리-기법)
8. [트랜잭션 처리](#8-트랜잭션-처리)
9. [마이크로서비스 아키텍처에서의 Prisma](#9-마이크로서비스-아키텍처에서의-prisma)
10. [성능 최적화](#10-성능-최적화)
11. [마이그레이션 전략](#11-마이그레이션-전략)
12. [테스트 전략](#12-테스트-전략)
13. [배포 및 운영](#13-배포-및-운영)
14. [실전 예제: 이커머스 마이크로서비스](#14-실전-예제-이커머스-마이크로서비스)

---

## 1. Prisma 소개

### Prisma란?
Prisma는 현대적인 Node.js/TypeScript ORM(Object-Relational Mapping)으로, 데이터베이스 작업을 타입 안전하게 수행할 수 있도록 도와줍니다.

### 주요 특징
- **타입 안전성**: TypeScript와 완벽한 통합
- **자동 완성**: IDE에서 강력한 자동 완성 지원
- **선언적 스키마**: 직관적인 데이터 모델 정의
- **마이그레이션**: 안전한 데이터베이스 스키마 변경
- **쿼리 최적화**: N+1 문제 자동 해결

### Prisma vs 전통적 ORM

```
전통적 ORM (예: TypeORM)          Prisma
─────────────────────────        ─────────────────────────
데코레이터 기반                    스키마 파일 기반
런타임 타입 검증                   컴파일 타임 타입 검증
복잡한 설정                        간단한 설정
성능 이슈 가능                     최적화된 쿼리
```

---

## 2. Prisma 아키�크처

### 전체 구조도

```
┌─────────────────────────────────────────────────────────┐
│                  애플리케이션 코드                          │
│                 (Node.js/TypeScript)                     │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Prisma Client (자동 생성)                     │
│  ┌──────────────────────────────────────────────────┐   │
│  │  타입 안전 API                                      │   │
│  │  - prisma.user.findMany()                        │   │
│  │  - prisma.post.create()                          │   │
│  └──────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                Prisma Query Engine                       │
│  ┌──────────────────────────────────────────────────┐   │
│  │  - 쿼리 최적화                                      │   │
│  │  - 배치 처리                                        │   │
│  │  - 커넥션 풀링                                      │   │
│  └──────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                   데이터베이스                             │
│        (PostgreSQL, MySQL, MongoDB 등)                  │
└─────────────────────────────────────────────────────────┘
```

### Prisma 주요 컴포넌트

```
schema.prisma
    ↓
    ├─→ Prisma Migrate ─→ 데이터베이스 스키마 생성/변경
    │
    └─→ Prisma Client Generator ─→ 타입 안전 클라이언트 생성
```

---

## 3. 기본 설정 및 시작하기

### 설치

```bash
# 새 프로젝트 초기화
npm init -y
npm install typescript ts-node @types/node --save-dev

# Prisma 설치
npm install prisma --save-dev
npm install @prisma/client

# Prisma 초기화
npx prisma init
```

### 프로젝트 구조

```
my-service/
├── prisma/
│   ├── schema.prisma      # 데이터 모델 정의
│   └── migrations/        # 마이그레이션 히스토리
├── src/
│   ├── index.ts
│   └── db.ts              # Prisma 클라이언트 설정
├── package.json
└── tsconfig.json
```

### 기본 설정 파일

**schema.prisma**
```prisma
// 데이터소스 설정
datasource db {
  provider = "postgresql"  // mysql, mongodb, sqlite 등
  url      = env("DATABASE_URL")
}

// 클라이언트 생성기 설정
generator client {
  provider = "prisma-client-js"
}
```

**db.ts** (클라이언트 초기화)
```typescript
import { PrismaClient } from '@prisma/client'

// 싱글톤 패턴으로 클라이언트 생성
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

export default prisma
```

---

## 4. Prisma Schema 기초

### 모델 정의

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?  // ? = 옵셔널
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  posts     Post[]   // 일대다 관계
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  authorId  Int
  author    User     @relation(fields: [authorId], references: [id])
  createdAt DateTime @default(now())
  
  @@index([authorId])  // 인덱스 추가
}
```

### 필드 타입

```
Prisma 타입        데이터베이스 타입       TypeScript 타입
────────────────  ──────────────────    ─────────────────
String            VARCHAR/TEXT          string
Int               INTEGER               number
BigInt            BIGINT                bigint
Float             DOUBLE                number
Decimal           DECIMAL               Decimal
Boolean           BOOLEAN               boolean
DateTime          TIMESTAMP             Date
Json              JSON                  JsonValue
Bytes             BYTEA                 Buffer
```

### 속성(Attributes)

```prisma
model Example {
  // 필드 레벨 속성
  id       Int     @id                    // 기본 키
  email    String  @unique                // 유니크 제약
  name     String  @default("Anonymous")   // 기본값
  count    Int     @default(0)
  created  DateTime @default(now())
  updated  DateTime @updatedAt            // 자동 업데이트
  
  // 블록 레벨 속성
  @@unique([email, name])     // 복합 유니크
  @@index([email])            // 인덱스
  @@map("examples")           // 테이블명 매핑
}
```

---

## 5. CRUD 작업

### Create (생성)

```typescript
// 단일 레코드 생성
const user = await prisma.user.create({
  data: {
    email: 'user@example.com',
    name: 'John Doe',
  },
})

// 관계와 함께 생성
const userWithPost = await prisma.user.create({
  data: {
    email: 'author@example.com',
    name: 'Jane Author',
    posts: {
      create: [
        { title: 'First Post', content: 'Hello World' },
        { title: 'Second Post', content: 'Prisma is great' },
      ],
    },
  },
  include: {
    posts: true,  // 생성된 posts도 함께 반환
  },
})

// 다중 레코드 생성
const users = await prisma.user.createMany({
  data: [
    { email: 'user1@example.com', name: 'User 1' },
    { email: 'user2@example.com', name: 'User 2' },
  ],
  skipDuplicates: true,  // 중복 무시
})
```

### Read (조회)

```typescript
// 단일 레코드 조회
const user = await prisma.user.findUnique({
  where: { email: 'user@example.com' },
})

// 첫 번째 레코드 조회
const firstUser = await prisma.user.findFirst({
  where: { name: { contains: 'John' } },
  orderBy: { createdAt: 'desc' },
})

// 다중 레코드 조회
const users = await prisma.user.findMany({
  where: {
    email: { endsWith: '@example.com' },
    posts: { some: { published: true } },
  },
  orderBy: { createdAt: 'desc' },
  take: 10,  // LIMIT
  skip: 20,  // OFFSET
})

// 전체 개수 조회
const count = await prisma.user.count({
  where: { posts: { some: { published: true } } },
})
```

### Update (수정)

```typescript
// 단일 레코드 수정
const user = await prisma.user.update({
  where: { id: 1 },
  data: { name: 'Updated Name' },
})

// 다중 레코드 수정
const result = await prisma.user.updateMany({
  where: { email: { contains: 'example.com' } },
  data: { name: 'Bulk Updated' },
})

// Upsert (있으면 수정, 없으면 생성)
const user = await prisma.user.upsert({
  where: { email: 'user@example.com' },
  update: { name: 'Updated' },
  create: { email: 'user@example.com', name: 'New User' },
})
```

### Delete (삭제)

```typescript
// 단일 레코드 삭제
const user = await prisma.user.delete({
  where: { id: 1 },
})

// 다중 레코드 삭제
const result = await prisma.user.deleteMany({
  where: { email: { endsWith: '@spam.com' } },
})

// 모두 삭제
await prisma.user.deleteMany()
```

---

## 6. 관계형 데이터 모델링

### 관계 타입 도식화

```
일대일 (One-to-One)
User ────────────── Profile
  1                    1

일대다 (One-to-Many)
User ────────────── Post
  1                  many

다대다 (Many-to-Many)
Post ────────────── Category
 many                many
```

### 일대일 관계

```prisma
model User {
  id      Int      @id @default(autoincrement())
  email   String   @unique
  profile Profile?
}

model Profile {
  id     Int    @id @default(autoincrement())
  bio    String
  userId Int    @unique
  user   User   @relation(fields: [userId], references: [id])
}
```

```typescript
// 사용 예제
const userWithProfile = await prisma.user.create({
  data: {
    email: 'user@example.com',
    profile: {
      create: { bio: 'Hello, I am a developer' },
    },
  },
  include: { profile: true },
})
```

### 일대다 관계

```prisma
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
  
  @@index([authorId])
}
```

```typescript
// 관계 포함 조회
const userWithPosts = await prisma.user.findUnique({
  where: { id: 1 },
  include: {
    posts: {
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      take: 5,
    },
  },
})
```

### 다대다 관계

```prisma
// 명시적 중간 테이블
model Post {
  id         Int            @id @default(autoincrement())
  title      String
  categories PostCategory[]
}

model Category {
  id    Int            @id @default(autoincrement())
  name  String         @unique
  posts PostCategory[]
}

model PostCategory {
  postId     Int
  categoryId Int
  assignedAt DateTime @default(now())
  
  post     Post     @relation(fields: [postId], references: [id])
  category Category @relation(fields: [categoryId], references: [id])
  
  @@id([postId, categoryId])
}
```

```typescript
// 다대다 관계 생성
const post = await prisma.post.create({
  data: {
    title: 'My Post',
    categories: {
      create: [
        { category: { connect: { id: 1 } } },
        { category: { connect: { id: 2 } } },
      ],
    },
  },
})
```

### 자기 참조 관계

```prisma
model User {
  id        Int    @id @default(autoincrement())
  email     String @unique
  followers User[] @relation("UserFollows")
  following User[] @relation("UserFollows")
}
```

---

## 7. 고급 쿼리 기법

### 필터링 연산자

```typescript
// 문자열 필터
const users = await prisma.user.findMany({
  where: {
    email: { contains: 'example' },      // LIKE '%example%'
    name: { startsWith: 'John' },        // LIKE 'John%'
    name: { endsWith: 'Doe' },           // LIKE '%Doe'
    email: { not: { endsWith: '.com' } }, // NOT LIKE '%.com'
  },
})

// 숫자 필터
const posts = await prisma.post.findMany({
  where: {
    views: { gt: 100 },          // >
    likes: { gte: 50 },          // >=
    dislikes: { lt: 10 },        // <
    comments: { lte: 20 },       // <=
    score: { in: [1, 2, 3] },    // IN
    rating: { not: { in: [0] } }, // NOT IN
  },
})

// 날짜 필터
const recentPosts = await prisma.post.findMany({
  where: {
    createdAt: {
      gte: new Date('2024-01-01'),
      lte: new Date('2024-12-31'),
    },
  },
})
```

### 논리 연산자

```typescript
// AND (기본)
const users = await prisma.user.findMany({
  where: {
    email: { contains: 'example' },
    name: { not: null },
  },
})

// OR
const users = await prisma.user.findMany({
  where: {
    OR: [
      { email: { contains: 'gmail' } },
      { email: { contains: 'yahoo' } },
    ],
  },
})

// NOT
const users = await prisma.user.findMany({
  where: {
    NOT: {
      email: { endsWith: '@spam.com' },
    },
  },
})

// 복합 조건
const users = await prisma.user.findMany({
  where: {
    AND: [
      { posts: { some: { published: true } } },
      {
        OR: [
          { email: { contains: 'gmail' } },
          { email: { contains: 'yahoo' } },
        ],
      },
    ],
  },
})
```

### 관계 필터

```typescript
// some: 하나라도 만족
const users = await prisma.user.findMany({
  where: {
    posts: {
      some: {
        published: true,
        views: { gt: 1000 },
      },
    },
  },
})

// every: 모두 만족
const users = await prisma.user.findMany({
  where: {
    posts: {
      every: {
        published: true,
      },
    },
  },
})

// none: 하나도 만족하지 않음
const users = await prisma.user.findMany({
  where: {
    posts: {
      none: {
        published: false,
      },
    },
  },
})
```

### 집계 함수

```typescript
// 기본 집계
const aggregation = await prisma.post.aggregate({
  _count: { id: true },
  _avg: { views: true },
  _sum: { likes: true },
  _min: { createdAt: true },
  _max: { createdAt: true },
  where: { published: true },
})

// 그룹화
const groupedData = await prisma.post.groupBy({
  by: ['authorId', 'published'],
  _count: { id: true },
  _avg: { views: true },
  having: {
    views: { _avg: { gt: 100 } },
  },
})
```

### Select와 Include

```typescript
// select: 특정 필드만 선택
const users = await prisma.user.findMany({
  select: {
    id: true,
    email: true,
    posts: {
      select: {
        title: true,
        published: true,
      },
    },
  },
})

// include: 관계 포함
const users = await prisma.user.findMany({
  include: {
    posts: true,
    profile: true,
  },
})

// 중첩 select
const users = await prisma.user.findMany({
  select: {
    id: true,
    posts: {
      select: {
        title: true,
        categories: {
          select: {
            category: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    },
  },
})
```

---

## 8. 트랜잭션 처리

### 트랜잭션이 필요한 경우

```
시나리오: 은행 계좌 이체
1. A 계좌에서 금액 차감
2. B 계좌에 금액 추가
→ 둘 중 하나라도 실패하면 전체 롤백 필요
```

### 순차 트랜잭션

```typescript
// $transaction을 사용한 순차 처리
const [decremented, incremented] = await prisma.$transaction([
  prisma.account.update({
    where: { id: fromAccountId },
    data: { balance: { decrement: amount } },
  }),
  prisma.account.update({
    where: { id: toAccountId },
    data: { balance: { increment: amount } },
  }),
])
```

### 인터랙티브 트랜잭션

```typescript
// 복잡한 로직이 포함된 트랜잭션
const result = await prisma.$transaction(async (tx) => {
  // 1. 계좌 잔액 확인
  const fromAccount = await tx.account.findUnique({
    where: { id: fromAccountId },
  })
  
  if (!fromAccount || fromAccount.balance < amount) {
    throw new Error('잔액 부족')
  }
  
  // 2. 출금
  await tx.account.update({
    where: { id: fromAccountId },
    data: { balance: { decrement: amount } },
  })
  
  // 3. 입금
  await tx.account.update({
    where: { id: toAccountId },
    data: { balance: { increment: amount } },
  })
  
  // 4. 거래 내역 기록
  const transaction = await tx.transaction.create({
    data: {
      fromAccountId,
      toAccountId,
      amount,
      type: 'TRANSFER',
    },
  })
  
  return transaction
}, {
  maxWait: 5000,      // 트랜잭션 대기 시간
  timeout: 10000,     // 트랜잭션 실행 시간
  isolationLevel: 'Serializable',  // 격리 수준
})
```

### 낙관적 동시성 제어

```prisma
model Product {
  id       Int    @id @default(autoincrement())
  name     String
  stock    Int
  version  Int    @default(0)  // 버전 필드
}
```

```typescript
async function decreaseStock(productId: number, quantity: number) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
  })
  
  if (!product) throw new Error('상품을 찾을 수 없습니다')
  if (product.stock < quantity) throw new Error('재고 부족')
  
  // 버전 확인하며 업데이트
  const updated = await prisma.product.updateMany({
    where: {
      id: productId,
      version: product.version,  // 이전 버전과 일치해야 함
    },
    data: {
      stock: { decrement: quantity },
      version: { increment: 1 },
    },
  })
  
  if (updated.count === 0) {
    throw new Error('동시성 충돌 발생')
  }
}
```

---

## 9. 마이크로서비스 아키텍처에서의 Prisma

### 마이크로서비스 패턴 도식화

```
┌─────────────────────────────────────────────────────────────┐
│                      API Gateway                             │
└────────┬──────────────┬──────────────┬──────────────────────┘
         │              │              │
         ▼              ▼              ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│   User      │  │   Order     │  │   Product   │
│   Service   │  │   Service   │  │   Service   │
├─────────────┤  ├─────────────┤  ├─────────────┤
│   Prisma    │  │   Prisma    │  │   Prisma    │
│   Client    │  │   Client    │  │   Client    │
└──────┬──────┘  └──────┬──────┘  └──────┬──────┘
       │                │                │
       ▼                ▼                ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│   User DB   │  │   Order DB  │  │  Product DB │
└─────────────┘  └─────────────┘  └─────────────┘
```

### Database per Service 패턴

각 마이크로서비스는 자신만의 데이터베이스를 가집니다.

**User Service (schema.prisma)**
```prisma
datasource db {
  provider = "postgresql"
  url      = env("USER_DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**Order Service (schema.prisma)**
```prisma
datasource db {
  provider = "postgresql"
  url      = env("ORDER_DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Order {
  id        String   @id @default(uuid())
  userId    String   // 외래 키가 아님! 다른 서비스 참조
  total     Decimal
  status    OrderStatus
  items     OrderItem[]
  createdAt DateTime @default(now())
}

model OrderItem {
  id        String  @id @default(uuid())
  orderId   String
  productId String  // 다른 서비스 참조
  quantity  Int
  price     Decimal
  order     Order   @relation(fields: [orderId], references: [id])
}

enum OrderStatus {
  PENDING
  CONFIRMED
  SHIPPED
  DELIVERED
  CANCELLED
}
```

### 서비스 간 통신 패턴

```typescript
// Order Service에서 User 정보 조회
import axios from 'axios'

class OrderService {
  async createOrder(userId: string, items: OrderItem[]) {
    // 1. User Service에서 사용자 검증
    const userResponse = await axios.get(
      `${process.env.USER_SERVICE_URL}/users/${userId}`
    )
    
    if (!userResponse.data) {
      throw new Error('사용자를 찾을 수 없습니다')
    }
    
    // 2. Product Service에서 상품 정보 및 재고 확인
    const productIds = items.map(item => item.productId)
    const productsResponse = await axios.post(
      `${process.env.PRODUCT_SERVICE_URL}/products/batch`,
      { ids: productIds }
    )
    
    // 3. 주문 생성
    const order = await prisma.order.create({
      data: {
        userId,
        total: this.calculateTotal(items, productsResponse.data),
        status: 'PENDING',
        items: {
          create: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: { items: true },
    })
    
    return order
  }
}
```

### Saga 패턴 구현

분산 트랜잭션을 위한 Saga 패턴 예제:

```typescript
// Orchestration-based Saga
class OrderSaga {
  async executeOrderCreation(orderData: CreateOrderDTO) {
    const sagaId = uuidv4()
    
    try {
      // Step 1: 주문 생성 (PENDING 상태)
      const order = await prisma.order.create({
        data: {
          ...orderData,
          status: 'PENDING',
          sagaId,
        },
      })
      
      // Step 2: 재고 예약
      const reservationResult = await this.reserveInventory(
        order.items,
        sagaId
      )
      
      if (!reservationResult.success) {
        await this.compensateOrderCreation(order.id)
        throw new Error('재고 예약 실패')
      }
      
      // Step 3: 결제 처리
      const paymentResult = await this.processPayment(
        order.userId,
        order.total,
        sagaId
      )
      
      if (!paymentResult.success) {
        await this.compensateInventoryReservation(sagaId)
        await this.compensateOrderCreation(order.id)
        throw new Error('결제 실패')
      }
      
      // Step 4: 주문 확정
      const confirmedOrder = await prisma.order.update({
        where: { id: order.id },
        data: { status: 'CONFIRMED' },
      })
      
      return confirmedOrder
    } catch (error) {
      // 보상 트랜잭션 실행
      console.error('Saga 실행 실패:', error)
      throw error
    }
  }
  
  private async compensateOrderCreation(orderId: string) {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED' },
    })
  }
  
  private async compensateInventoryReservation(sagaId: string) {
    await axios.post(
      `${process.env.INVENTORY_SERVICE_URL}/reservations/cancel`,
      { sagaId }
    )
  }
}
```

### 이벤트 소싱 패턴

```prisma
model Event {
  id            String   @id @default(uuid())
  aggregateId   String   // 주문 ID, 사용자 ID 등
  aggregateType String   // Order, User 등
  eventType     String   // OrderCreated, OrderConfirmed 등
  payload       Json
  version       Int
  createdAt     DateTime @default(now())
  
  @@index([aggregateId, version])
  @@unique([aggregateId, version])
}
```

```typescript
class EventStore {
  async appendEvent(
    aggregateId: string,
    aggregateType: string,
    eventType: string,
    payload: any
  ) {
    // 현재 버전 조회
    const lastEvent = await prisma.event.findFirst({
      where: { aggregateId },
      orderBy: { version: 'desc' },
    })
    
    const nextVersion = (lastEvent?.version ?? 0) + 1
    
    // 이벤트 저장
    return await prisma.event.create({
      data: {
        aggregateId,
        aggregateType,
        eventType,
        payload,
        version: nextVersion,
      },
    })
  }
  
  async getEvents(aggregateId: string) {
    return await prisma.event.findMany({
      where: { aggregateId },
      orderBy: { version: 'asc' },
    })
  }
  
  // 이벤트로부터 현재 상태 재구성
  async replayEvents(aggregateId: string) {
    const events = await this.getEvents(aggregateId)
    
    let state = {}
    for (const event of events) {
      state = this.applyEvent(state, event)
    }
    
    return state
  }
}
```

### CQRS 패턴

Command와 Query를 분리하는 패턴:

```prisma
// Write Model (Command)
model OrderWrite {
  id        String   @id @default(uuid())
  userId    String
  total     Decimal
  status    OrderStatus
  createdAt DateTime @default(now())
  
  @@map("orders_write")
}

// Read Model (Query) - 비정규화된 데이터
model OrderRead {
  id            String   @id
  userId        String
  userName      String   // 비정규화
  userEmail     String   // 비정규화
  total         Decimal
  status        String
  itemCount     Int      // 계산된 값
  productNames  String[] // 비정규화된 배열
  createdAt     DateTime
  
  @@map("orders_read")
  @@index([userId])
  @@index([status])
}
```

```typescript
// Command Handler
class CreateOrderCommandHandler {
  async handle(command: CreateOrderCommand) {
    // Write Model에 저장
    const order = await prisma.orderWrite.create({
      data: command.data,
    })
    
    // 이벤트 발행
    await eventBus.publish('OrderCreated', {
      orderId: order.id,
      userId: order.userId,
      total: order.total,
    })
    
    return order
  }
}

// Event Handler - Read Model 업데이트
class OrderCreatedEventHandler {
  async handle(event: OrderCreatedEvent) {
    // 사용자 정보 조회
    const user = await axios.get(
      `${process.env.USER_SERVICE_URL}/users/${event.userId}`
    )
    
    // Read Model 생성
    await prisma.orderRead.create({
      data: {
        id: event.orderId,
        userId: event.userId,
        userName: user.data.name,
        userEmail: user.data.email,
        total: event.total,
        status: 'PENDING',
        itemCount: event.items.length,
        productNames: event.items.map(i => i.productName),
        createdAt: new Date(),
      },
    })
  }
}
```

---

## 10. 성능 최적화

### N+1 문제 해결

```typescript
// ❌ N+1 문제 발생
const users = await prisma.user.findMany()
for (const user of users) {
  const posts = await prisma.post.findMany({
    where: { authorId: user.id },
  })
  console.log(user.name, posts.length)
}

// ✅ include로 해결
const users = await prisma.user.findMany({
  include: { posts: true },
})

// ✅ select로 필요한 필드만 조회
const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    posts: {
      select: {
        id: true,
        title: true,
      },
    },
  },
})
```

### 인덱스 전략

```prisma
model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String
  published Boolean
  authorId  Int
  createdAt DateTime @default(now())
  views     Int      @default(0)
  
  // 단일 컬럼 인덱스
  @@index([authorId])
  @@index([published])
  @@index([createdAt])
  
  // 복합 인덱스 (순서 중요!)
  @@index([authorId, published, createdAt])
  
  // 전문 검색 인덱스 (PostgreSQL)
  @@index([title], type: Hash)
}
```

### 커넥션 풀링

```typescript
// prisma/client.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  // 커넥션 풀 설정
  // DATABASE_URL="postgresql://user:password@localhost:5432/mydb?connection_limit=10&pool_timeout=20"
})

// 글로벌 싱글톤
declare global {
  var prisma: PrismaClient | undefined
}

export const db = global.prisma || prisma

if (process.env.NODE_ENV !== 'production') {
  global.prisma = db
}
```

### 배치 쿼리

```typescript
// ❌ 개별 쿼리
for (const userId of userIds) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  })
}

// ✅ 단일 쿼리로 배치 처리
const users = await prisma.user.findMany({
  where: {
    id: { in: userIds },
  },
})
```

### 페이지네이션 최적화

```typescript
// Offset 기반 (대용량 데이터에는 비효율적)
async function getPostsOffset(page: number, pageSize: number) {
  return await prisma.post.findMany({
    take: pageSize,
    skip: (page - 1) * pageSize,
    orderBy: { createdAt: 'desc' },
  })
}

// ✅ Cursor 기반 (효율적)
async function getPostsCursor(cursor?: string, pageSize: number = 20) {
  return await prisma.post.findMany({
    take: pageSize,
    ...(cursor && {
      skip: 1,  // cursor 항목 제외
      cursor: { id: cursor },
    }),
    orderBy: { createdAt: 'desc' },
  })
}
```

### 캐싱 전략

```typescript
import Redis from 'ioredis'

const redis = new Redis()

async function getUserWithCache(userId: string) {
  // 1. 캐시 확인
  const cached = await redis.get(`user:${userId}`)
  if (cached) {
    return JSON.parse(cached)
  }
  
  // 2. DB 조회
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true },
  })
  
  // 3. 캐시 저장 (1시간)
  if (user) {
    await redis.setex(`user:${userId}`, 3600, JSON.stringify(user))
  }
  
  return user
}

// 캐시 무효화
async function updateUserAndInvalidateCache(userId: string, data: any) {
  const user = await prisma.user.update({
    where: { id: userId },
    data,
  })
  
  await redis.del(`user:${userId}`)
  
  return user
}
```

---

## 11. 마이그레이션 전략

### 마이그레이션 워크플로우

```
개발 환경                      프로덕션 환경
─────────────────────────     ─────────────────────────
1. schema.prisma 수정
         ↓
2. npx prisma migrate dev
   (마이그레이션 파일 생성)
         ↓
3. Git 커밋
         ↓
4. CI/CD                  →   5. npx prisma migrate deploy
                                  (마이그레이션 실행)
```

### 기본 마이그레이션 명령어

```bash
# 개발 환경: 마이그레이션 생성 및 적용
npx prisma migrate dev --name add_user_profile

# 프로덕션 환경: 마이그레이션만 적용
npx prisma migrate deploy

# 마이그레이션 상태 확인
npx prisma migrate status

# 마이그레이션 리셋 (주의: 모든 데이터 삭제)
npx prisma migrate reset

# 현재 DB 스키마를 Prisma Schema로 동기화
npx prisma db pull
```

### 안전한 마이그레이션 예제

**추가 가능한 변경 (안전)**
```prisma
// Before
model User {
  id    Int    @id
  email String @unique
}

// After - 새 컬럼 추가 (nullable 또는 default)
model User {
  id        Int      @id
  email     String   @unique
  name      String?  // nullable (안전)
  createdAt DateTime @default(now())  // default (안전)
}
```

**위험한 변경과 안전한 대안**

```prisma
// ❌ 위험: 컬럼 타입 변경
model User {
  id Int String @id  // Int → String 직접 변경은 위험
}

// ✅ 안전한 방법: 단계적 마이그레이션
// Step 1: 새 컬럼 추가
model User {
  id     Int    @id
  id_new String? @unique
}

// Step 2: 데이터 마이그레이션 스크립트 실행
// Step 3: 애플리케이션 코드 업데이트
// Step 4: 기존 컬럼 제거
```

### 데이터 마이그레이션 스크립트

```typescript
// prisma/migrations/20240101_migrate_user_ids.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function migrateUserIds() {
  const users = await prisma.user.findMany()
  
  for (const user of users) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        id_new: user.id.toString(),
      },
    })
  }
  
  console.log(`마이그레이션 완료: ${users.length}개 레코드`)
}

migrateUserIds()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

### 무중단 마이그레이션 전략

```
Phase 1: Expand (확장)
┌─────────────────────────────────────────┐
│  Old Column    New Column               │
│  ───────────   ───────────               │
│  id (Int)      id_new (String?) 추가     │
│  ✓ 기존 코드 동작                         │
│  ✓ 새 컬럼 nullable                      │
└─────────────────────────────────────────┘

Phase 2: Migrate (마이그레이션)
┌─────────────────────────────────────────┐
│  데이터 복사 및 변환                       │
│  id → id_new                            │
│  배포된 모든 인스턴스에서 동시 쓰기         │
└─────────────────────────────────────────┘

Phase 3: Contract (축소)
┌─────────────────────────────────────────┐
│  Old Column    New Column               │
│  ───────────   ───────────               │
│  (삭제됨)       id_new → id로 rename      │
│  ✓ 기존 컬럼 제거                         │
└─────────────────────────────────────────┘
```

---

## 12. 테스트 전략

### 테스트 데이터베이스 설정

```typescript
// prisma/test-setup.ts
import { PrismaClient } from '@prisma/client'
import { execSync } from 'child_process'

const prisma = new PrismaClient()

export async function setupTestDatabase() {
  // 테스트 DB 초기화
  execSync('npx prisma migrate reset --force --skip-generate', {
    env: {
      ...process.env,
      DATABASE_URL: process.env.TEST_DATABASE_URL,
    },
  })
}

export async function cleanupTestDatabase() {
  // 모든 테이블 데이터 삭제
  const tables = await prisma.$queryRaw<Array<{ tablename: string }>>`
    SELECT tablename FROM pg_tables WHERE schemaname='public'
  `
  
  for (const { tablename } of tables) {
    if (tablename !== '_prisma_migrations') {
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${tablename}" CASCADE`)
    }
  }
}

export { prisma }
```

### 유닛 테스트

```typescript
// tests/user.service.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { prisma, cleanupTestDatabase } from './test-setup'
import { UserService } from '../src/services/user.service'

describe('UserService', () => {
  beforeEach(async () => {
    await cleanupTestDatabase()
  })
  
  it('should create a user', async () => {
    const userService = new UserService(prisma)
    
    const user = await userService.createUser({
      email: 'test@example.com',
      name: 'Test User',
    })
    
    expect(user).toBeDefined()
    expect(user.email).toBe('test@example.com')
    expect(user.name).toBe('Test User')
  })
  
  it('should find user by email', async () => {
    const userService = new UserService(prisma)
    
    await userService.createUser({
      email: 'test@example.com',
      name: 'Test User',
    })
    
    const found = await userService.findByEmail('test@example.com')
    
    expect(found).toBeDefined()
    expect(found?.email).toBe('test@example.com')
  })
  
  it('should throw error on duplicate email', async () => {
    const userService = new UserService(prisma)
    
    await userService.createUser({
      email: 'test@example.com',
      name: 'Test User',
    })
    
    await expect(
      userService.createUser({
        email: 'test@example.com',
        name: 'Another User',
      })
    ).rejects.toThrow()
  })
})
```

### 통합 테스트

```typescript
// tests/order.integration.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'
import { prisma, cleanupTestDatabase } from './test-setup'

describe('Order API Integration', () => {
  beforeEach(async () => {
    await cleanupTestDatabase()
  })
  
  it('should create order with items', async () => {
    // 1. 사용자 생성
    const user = await prisma.user.create({
      data: {
        email: 'customer@example.com',
        name: 'Customer',
      },
    })
    
    // 2. 상품 생성
    const product = await prisma.product.create({
      data: {
        name: 'Test Product',
        price: 100,
        stock: 10,
      },
    })
    
    // 3. 주문 생성 API 호출
    const response = await request(app)
      .post('/api/orders')
      .send({
        userId: user.id,
        items: [
          {
            productId: product.id,
            quantity: 2,
          },
        ],
      })
      .expect(201)
    
    // 4. 검증
    expect(response.body).toHaveProperty('id')
    expect(response.body.total).toBe(200)
    expect(response.body.items).toHaveLength(1)
    
    // 5. DB 상태 확인
    const order = await prisma.order.findUnique({
      where: { id: response.body.id },
      include: { items: true },
    })
    
    expect(order).toBeDefined()
    expect(order?.items).toHaveLength(1)
  })
})
```

### 목(Mock) 사용

```typescript
// tests/user.service.mock.test.ts
import { describe, it, expect, vi } from 'vitest'
import { UserService } from '../src/services/user.service'

describe('UserService with Mocks', () => {
  it('should handle external API failure gracefully', async () => {
    // Prisma Client 목 생성
    const prismaMock = {
      user: {
        create: vi.fn().mockResolvedValue({
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
        }),
      },
    }
    
    // 외부 API 목 생성
    const externalApiMock = vi.fn().mockRejectedValue(
      new Error('API 연결 실패')
    )
    
    const userService = new UserService(
      prismaMock as any,
      externalApiMock
    )
    
    // 외부 API 실패해도 사용자는 생성되어야 함
    const user = await userService.createUserWithNotification({
      email: 'test@example.com',
      name: 'Test User',
    })
    
    expect(user).toBeDefined()
    expect(prismaMock.user.create).toHaveBeenCalled()
    expect(externalApiMock).toHaveBeenCalled()
  })
})
```

---

## 13. 배포 및 운영

### 환경 변수 관리

```bash
# .env.development
DATABASE_URL="postgresql://user:password@localhost:5432/myapp_dev"
NODE_ENV="development"
LOG_LEVEL="debug"

# .env.production
DATABASE_URL="postgresql://user:password@prod-db:5432/myapp_prod?connection_limit=10&pool_timeout=20"
NODE_ENV="production"
LOG_LEVEL="info"
```

### Docker 설정

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

COPY . .

RUN npm run build
RUN npx prisma generate

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY package*.json ./

EXPOSE 3000

# 마이그레이션 실행 후 앱 시작
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  db:
    image: postgres:15
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: myapp
    volumes:
      - postgres-data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
  
  app:
    build: .
    environment:
      DATABASE_URL: postgresql://user:password@db:5432/myapp
      NODE_ENV: production
    ports:
      - "3000:3000"
    depends_on:
      - db

volumes:
  postgres-data:
```

### 모니터링 및 로깅

```typescript
// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'event',
      level: 'error',
    },
    {
      emit: 'event',
      level: 'info',
    },
    {
      emit: 'event',
      level: 'warn',
    },
  ],
})

// 쿼리 로깅
prisma.$on('query', (e) => {
  console.log('Query: ' + e.query)
  console.log('Duration: ' + e.duration + 'ms')
  
  // 느린 쿼리 경고
  if (e.duration > 1000) {
    console.warn('⚠️ Slow query detected:', e.query)
  }
})

// 에러 로깅
prisma.$on('error', (e) => {
  console.error('Prisma Error:', e)
})

export default prisma
```

### 헬스 체크

```typescript
// src/routes/health.ts
import express from 'express'
import prisma from '../lib/prisma'

const router = express.Router()

router.get('/health', async (req, res) => {
  try {
    // DB 연결 확인
    await prisma.$queryRaw`SELECT 1`
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
    })
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error.message,
    })
  }
})

export default router
```

---

## 14. 실전 예제: 이커머스 마이크로서비스

### 전체 아키텍처

```
                        ┌──────────────┐
                        │  API Gateway │
                        └──────┬───────┘
                               │
                ┌──────────────┼──────────────┐
                │              │              │
                ▼              ▼              ▼
        ┌───────────┐  ┌───────────┐  ┌───────────┐
        │   User    │  │   Order   │  │  Product  │
        │  Service  │  │  Service  │  │  Service  │
        └─────┬─────┘  └─────┬─────┘  └─────┬─────┘
              │              │              │
              ▼              ▼              ▼
        ┌───────────┐  ┌───────────┐  ┌───────────┐
        │  User DB  │  │ Order DB  │  │Product DB │
        └───────────┘  └───────────┘  └───────────┘
```

### User Service Schema

```prisma
// user-service/prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("USER_DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  password  String
  role      UserRole @default(CUSTOMER)
  profile   Profile?
  addresses Address[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([email])
}

model Profile {
  id          String  @id @default(uuid())
  userId      String  @unique
  user        User    @relation(fields: [userId], references: [id])
  phone       String?
  dateOfBirth DateTime?
  avatar      String?
}

model Address {
  id        String  @id @default(uuid())
  userId    String
  user      User    @relation(fields: [userId], references: [id])
  street    String
  city      String
  state     String
  zipCode   String
  country   String
  isDefault Boolean @default(false)
  
  @@index([userId])
}

enum UserRole {
  CUSTOMER
  ADMIN
  SELLER
}
```

### Product Service Schema

```prisma
// product-service/prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("PRODUCT_DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Product {
  id          String     @id @default(uuid())
  name        String
  description String?
  price       Decimal    @db.Decimal(10, 2)
  stock       Int
  sku         String     @unique
  sellerId    String     // User Service 참조
  images      Image[]
  categories  ProductCategory[]
  reviews     Review[]
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  
  @@index([sellerId])
  @@index([sku])
}

model Category {
  id       String            @id @default(uuid())
  name     String            @unique
  slug     String            @unique
  products ProductCategory[]
}

model ProductCategory {
  productId  String
  categoryId String
  product    Product  @relation(fields: [productId], references: [id])
  category   Category @relation(fields: [categoryId], references: [id])
  
  @@id([productId, categoryId])
}

model Image {
  id        String  @id @default(uuid())
  productId String
  product   Product @relation(fields: [productId], references: [id])
  url       String
  alt       String?
  order     Int     @default(0)
  
  @@index([productId])
}

model Review {
  id         String   @id @default(uuid())
  productId  String
  product    Product  @relation(fields: [productId], references: [id])
  userId     String   // User Service 참조
  rating     Int      // 1-5
  comment    String?
  createdAt  DateTime @default(now())
  
  @@index([productId])
  @@index([userId])
}
```

### Order Service Schema

```prisma
// order-service/prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("ORDER_DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Order {
  id              String       @id @default(uuid())
  orderNumber     String       @unique
  userId          String       // User Service 참조
  status          OrderStatus  @default(PENDING)
  subtotal        Decimal      @db.Decimal(10, 2)
  tax             Decimal      @db.Decimal(10, 2)
  shippingCost    Decimal      @db.Decimal(10, 2)
  total           Decimal      @db.Decimal(10, 2)
  items           OrderItem[]
  payment         Payment?
  shipping        Shipping?
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt
  
  @@index([userId])
  @@index([status])
  @@index([orderNumber])
}

model OrderItem {
  id          String  @id @default(uuid())
  orderId     String
  order       Order   @relation(fields: [orderId], references: [id])
  productId   String  // Product Service 참조
  productName String  // 스냅샷
  quantity    Int
  price       Decimal @db.Decimal(10, 2)
  subtotal    Decimal @db.Decimal(10, 2)
  
  @@index([orderId])
}

model Payment {
  id              String        @id @default(uuid())
  orderId         String        @unique
  order           Order         @relation(fields: [orderId], references: [id])
  method          PaymentMethod
  status          PaymentStatus @default(PENDING)
  transactionId   String?
  amount          Decimal       @db.Decimal(10, 2)
  paidAt          DateTime?
  createdAt       DateTime      @default(now())
}

model Shipping {
  id            String         @id @default(uuid())
  orderId       String         @unique
  order         Order          @relation(fields: [orderId], references: [id])
  addressId     String         // User Service의 Address 참조
  carrier       String?
  trackingNumber String?
  status        ShippingStatus @default(PREPARING)
  shippedAt     DateTime?
  deliveredAt   DateTime?
  createdAt     DateTime       @default(now())
}

enum OrderStatus {
  PENDING
  CONFIRMED
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
  REFUNDED
}

enum PaymentMethod {
  CREDIT_CARD
  DEBIT_CARD
  PAYPAL
  BANK_TRANSFER
}

enum PaymentStatus {
  PENDING
  COMPLETED
  FAILED
  REFUNDED
}

enum ShippingStatus {
  PREPARING
  SHIPPED
  IN_TRANSIT
  DELIVERED
}
```

### Order Service 구현 예제

```typescript
// order-service/src/services/order.service.ts
import { PrismaClient, OrderStatus } from '@prisma/client'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

const prisma = new PrismaClient()

export class OrderService {
  async createOrder(userId: string, items: CreateOrderItemDTO[]) {
    // 1. 사용자 검증 (User Service)
    const userResponse = await axios.get(
      `${process.env.USER_SERVICE_URL}/users/${userId}`
    )
    if (!userResponse.data) {
      throw new Error('사용자를 찾을 수 없습니다')
    }
    
    // 2. 상품 정보 및 재고 확인 (Product Service)
    const productIds = items.map(item => item.productId)
    const productsResponse = await axios.post(
      `${process.env.PRODUCT_SERVICE_URL}/products/batch`,
      { ids: productIds