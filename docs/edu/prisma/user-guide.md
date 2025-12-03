# Prisma 사용자 가이드 (초급자용)

이 가이드는 Prisma를 처음 접하는 개발자가 All-ERP 프로젝트에서 Prisma를 사용하는 방법을 단계별로 설명합니다.

## 📖 목차

- [시작하기](#시작하기)
- [기본 개념](#기본-개념)
- [CRUD 작업](#crud-작업)
- [관계 다루기](#관계-다루기)
- [고급 쿼리](#고급-쿼리)
- [마이그레이션](#마이그레이션)
- [문제 해결](#문제-해결)

---

## 시작하기

### Prisma Client 생성

코드를 작성하기 전에 Prisma Client를 생성해야 합니다.

```bash
# Schema에서 Prisma Client 생성
pnpm prisma generate --schema=libs/shared/infra/prisma/schema.prisma

# 또는 프로젝트 루트에서
cd /data/all-erp
pnpm prisma generate --schema=libs/shared/infra/prisma/schema.prisma
```

> 💡 **언제 실행해야 하나요?**
>
> - 새로운 프로젝트를 클론한 직후
> - `schema.prisma` 파일을 수정한 후
> - `node_modules`를 재설치한 후

### PrismaService 사용하기

NestJS 서비스에서 PrismaService를 주입받아 사용합니다.

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@all-erp/shared/infra';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // 여기서 this.prisma를 사용하여 데이터베이스 작업 수행
}
```

---

## 기본 개념

### 1. 모델 (Model)

Schema에 정의된 데이터베이스 테이블입니다.

```prisma
model User {
    id       String @id @default(uuid())
    email    String @unique
    name     String?
    role     Role   @default(USER)
}
```

### 2. 타입 (Type)

Prisma Client가 자동으로 TypeScript 타입을 생성합니다.

```typescript
import { User, Role } from '@prisma/client';

// User 타입 사용
const user: User = await this.prisma.user.findUnique({
  where: { id: '123' },
});
```

### 3. 쿼리 메서드

| 메서드       | 설명                       | 반환 타입      |
| ------------ | -------------------------- | -------------- |
| `findUnique` | 고유한 레코드 1개 조회     | `User \| null` |
| `findMany`   | 여러 레코드 조회           | `User[]`       |
| `findFirst`  | 조건에 맞는 첫 번째 레코드 | `User \| null` |
| `create`     | 새 레코드 생성             | `User`         |
| `update`     | 레코드 수정                | `User`         |
| `delete`     | 레코드 삭제                | `User`         |
| `count`      | 레코드 개수 세기           | `number`       |

---

## CRUD 작업

### Create (생성)

```typescript
// 단일 레코드 생성
const user = await this.prisma.user.create({
  data: {
    email: 'user@example.com',
    name: '홍길동',
    role: 'USER',
  },
});

// 여러 레코드 생성
const users = await this.prisma.user.createMany({
  data: [
    { email: 'user1@example.com', name: '사용자1' },
    { email: 'user2@example.com', name: '사용자2' },
  ],
});
```

### Read (조회)

```typescript
// ID로 조회
const user = await this.prisma.user.findUnique({
  where: { id: 'user-id-123' },
});

// 이메일로 조회 (unique 필드)
const user = await this.prisma.user.findUnique({
  where: { email: 'user@example.com' },
});

// 조건으로 여러 레코드 조회
const users = await this.prisma.user.findMany({
  where: {
    role: 'ADMIN',
    tenantId: 'tenant-123',
  },
});

// 첫 번째 레코드만 조회
const firstUser = await this.prisma.user.findFirst({
  where: { role: 'ADMIN' },
});

// 특정 필드만 선택
const user = await this.prisma.user.findUnique({
  where: { id: 'user-id-123' },
  select: {
    id: true,
    email: true,
    name: true,
    // password는 제외
  },
});
```

### Update (수정)

```typescript
// 단일 레코드 수정
const updatedUser = await this.prisma.user.update({
  where: { id: 'user-id-123' },
  data: {
    name: '새 이름',
    role: 'ADMIN',
  },
});

// 여러 레코드 수정
const result = await this.prisma.user.updateMany({
  where: { role: 'USER' },
  data: { role: 'MANAGER' },
});

// 존재하면 수정, 없으면 생성 (Upsert)
const user = await this.prisma.user.upsert({
  where: { email: 'user@example.com' },
  update: { name: '수정된 이름' },
  create: {
    email: 'user@example.com',
    name: '새 이름',
  },
});
```

### Delete (삭제)

```typescript
// 단일 레코드 삭제
const deletedUser = await this.prisma.user.delete({
  where: { id: 'user-id-123' },
});

// 여러 레코드 삭제
const result = await this.prisma.user.deleteMany({
  where: { role: 'USER' },
});
```

---

## 관계 다루기

### 관계 조회 (Include)

```typescript
// Employee와 연결된 User 정보 함께 조회
const employee = await this.prisma.employee.findUnique({
  where: { id: 'emp-id-123' },
  include: {
    user: true,           // User 정보 포함
    department: true      // Department 정보 포함
  }
});

// 결과
{
  id: 'emp-id-123',
  userId: 'user-id-123',
  user: {
    id: 'user-id-123',
    email: 'emp@example.com',
    name: '직원1'
  },
  department: {
    id: 'dept-id-123',
    name: '개발팀'
  }
}
```

### 중첩 관계 조회

```typescript
// Employee -> User -> RefreshTokens까지 조회
const employee = await this.prisma.employee.findUnique({
  where: { id: 'emp-id-123' },
  include: {
    user: {
      include: {
        refreshTokens: true,
      },
    },
    department: true,
  },
});
```

### 관계와 함께 생성

```typescript
// User와 Employee를 동시에 생성
const employee = await this.prisma.employee.create({
  data: {
    salary: 50000,
    joinDate: new Date(),
    user: {
      create: {
        email: 'new@example.com',
        name: '신규 직원',
        password: hashedPassword,
      },
    },
    department: {
      connect: { id: 'dept-id-123' }, // 기존 Department 연결
    },
  },
});
```

---

## 고급 쿼리

### 필터링

```typescript
// AND 조건
const users = await this.prisma.user.findMany({
  where: {
    role: 'ADMIN',
    tenantId: 'tenant-123',
  },
});

// OR 조건
const users = await this.prisma.user.findMany({
  where: {
    OR: [{ role: 'ADMIN' }, { role: 'MANAGER' }],
  },
});

// NOT 조건
const users = await this.prisma.user.findMany({
  where: {
    NOT: {
      role: 'USER',
    },
  },
});

// 부분 일치 검색
const users = await this.prisma.user.findMany({
  where: {
    email: {
      contains: '@example.com', // 이메일에 '@example.com' 포함
    },
  },
});

// 날짜 범위 검색
const attendances = await this.prisma.attendance.findMany({
  where: {
    date: {
      gte: new Date('2025-01-01'), // 이상
      lte: new Date('2025-01-31'), // 이하
    },
  },
});
```

### 정렬

```typescript
// 단일 필드 정렬
const users = await this.prisma.user.findMany({
  orderBy: {
    createdAt: 'desc', // 최신순
  },
});

// 여러 필드 정렬
const users = await this.prisma.user.findMany({
  orderBy: [{ role: 'asc' }, { createdAt: 'desc' }],
});
```

### 페이지네이션

```typescript
// Offset 기반 페이징
const users = await this.prisma.user.findMany({
  skip: 20, // 처음 20개 건너뛰기
  take: 10, // 10개 가져오기
  orderBy: {
    createdAt: 'desc',
  },
});

// Cursor 기반 페이징 (더 효율적)
const users = await this.prisma.user.findMany({
  take: 10,
  cursor: {
    id: lastUserId, // 마지막으로 본 ID
  },
  skip: 1, // cursor를 포함하지 않기 위함
});
```

### 집계 (Aggregation)

```typescript
// 개수 세기
const userCount = await this.prisma.user.count({
  where: { role: 'ADMIN' },
});

// 합계, 평균 등
const result = await this.prisma.employee.aggregate({
  _avg: {
    salary: true, // 평균 급여
  },
  _sum: {
    salary: true, // 총 급여
  },
  _count: {
    id: true, // 직원 수
  },
  where: {
    tenantId: 'tenant-123',
  },
});
```

### Transaction (트랜잭션)

```typescript
// 여러 작업을 원자적으로 수행
const result = await this.prisma.$transaction(async (tx) => {
  // 1. User 생성
  const user = await tx.user.create({
    data: {
      email: 'new@example.com',
      password: hashedPassword,
    },
  });

  // 2. Employee 생성
  const employee = await tx.employee.create({
    data: {
      userId: user.id,
      salary: 50000,
      joinDate: new Date(),
    },
  });

  // 3. Department 업데이트
  await tx.department.update({
    where: { id: 'dept-id-123' },
    data: {
      /* ... */
    },
  });

  return { user, employee };
});

// 오류 발생 시 모든 작업이 롤백됩니다
```

---

## 마이그레이션

### Schema 수정하기

1. `libs/shared/infra/prisma/schema.prisma` 파일 수정

```prisma
model User {
    id       String @id @default(uuid())
    email    String @unique
    name     String?
    // 새 필드 추가
    phone    String?
    address  String?
}
```

2. 마이그레이션 생성

```bash
cd /data/all-erp
pnpm prisma migrate dev --name add-user-phone-address --schema=libs/shared/infra/prisma/schema.prisma
```

3. Prisma Client 재생성

```bash
pnpm prisma generate --schema=libs/shared/infra/prisma/schema.prisma
```

### 마이그레이션 명령어

```bash
# 개발 환경에서 마이그레이션 생성 및 적용
pnpm prisma migrate dev --schema=libs/shared/infra/prisma/schema.prisma

# 프로덕션 환경에 마이그레이션 적용
pnpm prisma migrate deploy --schema=libs/shared/infra/prisma/schema.prisma

# 마이그레이션 상태 확인
pnpm prisma migrate status --schema=libs/shared/infra/prisma/schema.prisma

# Schema와 DB 동기화 (개발용, 마이그레이션 없이)
pnpm prisma db push --schema=libs/shared/infra/prisma/schema.prisma
```

---

## 문제 해결

### 1. "PrismaClient is not a constructor" 오류

**원인**: Prisma Client가 생성되지 않았습니다.

**해결**:

```bash
pnpm prisma generate --schema=libs/shared/infra/prisma/schema.prisma
```

### 2. "Property 'user' does not exist" 오류

**원인**: Prisma Client에 모델 정보가 없습니다.

**해결**:

1. Schema 파일 확인
2. Prisma Client 재생성

```bash
pnpm prisma generate --schema=libs/shared/infra/prisma/schema.prisma
```

### 3. "Migration failed" 오류

**원인**: Schema와 DB가 동기화되지 않았습니다.

**해결**:

```bash
# 1. 현재 상태 확인
pnpm prisma migrate status --schema=libs/shared/infra/prisma/schema.prisma

# 2. 마이그레이션 재적용
pnpm prisma migrate dev --schema=libs/shared/infra/prisma/schema.prisma
```

### 4. Multi-tenancy 필터가 작동하지 않음

**원인**: TenantMiddleware가 설정되지 않았거나 tenantId가 전달되지 않았습니다.

**해결**:

1. Request Header에 `x-tenant-id` 포함 확인
2. TenantMiddleware 설정 확인
3. PrismaService의 setTenantId 호출 확인

### 5. 빌드 시 타입 오류

**원인**: Prisma Client가 최신 상태가 아닙니다.

**해결**:

```bash
# 1. 캐시 초기화
pnpm nx reset

# 2. Prisma Client 재생성
pnpm prisma generate --schema=libs/shared/infra/prisma/schema.prisma

# 3. 재빌드
pnpm nx build auth-service
```

---

## 실전 예제

### 사용자 인증 구현

```typescript
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async register(dto: RegisterDto) {
    // 1. 이메일 중복 확인
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('이미 존재하는 이메일입니다');
    }

    // 2. 비밀번호 해싱
    const hashedPassword = await hash(dto.password);

    // 3. 사용자 생성
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
        role: 'USER',
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        // password 제외
      },
    });

    return user;
  }

  async login(dto: LoginDto) {
    // 1. 사용자 조회
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('잘못된 인증 정보입니다');
    }

    // 2. 비밀번호 검증
    const valid = await verify(user.password, dto.password);

    if (!valid) {
      throw new UnauthorizedException('잘못된 인증 정보입니다');
    }

    // 3. 토큰 생성 및 저장
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7일
      },
    });

    return { accessToken, refreshToken };
  }
}
```

---

## 추가 학습 자료

- [Prisma 아키텍처 가이드](./architecture.md)
- [Prisma 공식 문서](https://www.prisma.io/docs)
- [NX 명령어 가이드](../nx/README.md)

---

**작성일**: 2025-12-03  
**버전**: 1.0.0
