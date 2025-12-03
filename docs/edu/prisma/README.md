# Prisma 학습 가이드

All-ERP 프로젝트에서 Prisma를 사용하기 위한 학습 자료 모음입니다.

## 📚 학습 순서

초급 개발자는 다음 순서로 문서를 학습하는 것을 권장합니다:

### 1단계: 기본 이해

- [Prisma 아키텍처 가이드](./architecture.md) 읽기
  - Prisma가 무엇인지 이해
  - 프로젝트에서 Prisma가 어떻게 사용되는지 파악

### 2단계: 실전 사용법

- [Prisma 사용자 가이드](./user-guide.md) 읽기
  - CRUD 작업 실습
  - 관계 다루기
  - 고급 쿼리 작성

### 3단계: 프로젝트 Schema 탐색

- [`schema.prisma`](file:///data/all-erp/libs/shared/infra/prisma/schema.prisma) 파일 읽기
  - 실제 데이터 모델 확인
  - 관계 구조 이해

## 🎯 빠른 시작

### 필수 명령어

```bash
# Prisma Client 생성
pnpm prisma generate --schema=libs/shared/infra/prisma/schema.prisma

# 프로젝트 빌드
pnpm nx build auth-service
```

### 첫 번째 쿼리 작성

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@all-erp/shared/infra';

@Injectable()
export class MyService {
  constructor(private prisma: PrismaService) {}

  async getUsers() {
    return this.prisma.user.findMany();
  }
}
```

## 📖 문서 목록

| 문서                                                                  | 설명                             | 대상        |
| --------------------------------------------------------------------- | -------------------------------- | ----------- |
| [아키텍처 가이드](./architecture.md)                                  | Prisma 아키텍처 및 Multi-tenancy | 전체 개발자 |
| [사용자 가이드](./user-guide.md)                                      | CRUD, 관계, 마이그레이션         | 초급~중급   |
| [Schema](file:///data/all-erp/libs/shared/infra/prisma/schema.prisma) | 실제 데이터 모델 정의            | 전체 개발자 |

## 🔗 외부 자료

- [Prisma 공식 문서](https://www.prisma.io/docs)
- [Prisma Getting Started](https://www.prisma.io/docs/getting-started)
- [Prisma Video Tutorials](https://www.youtube.com/c/PrismaData)

---

**작성일**: 2025-12-03  
**버전**: 1.0.0
