# Phase 4: 기술 부채 해소 (2주)

> **목표**: 중복 코드 제거, 타입 안전성 강화, 공통 패턴 추출

---

## 1주차: 타입 안전성 및 공통 코드 추출

---

## Task 4.1: any 타입 제거 - 공통 라이브러리

### 대상
- `libs/shared/*/src/`

### 작업 내용
1. Phase 1에서 생성된 `any-usage.txt` 분석
2. 적절한 타입으로 교체
3. 제네릭 활용

### 교체 패턴
```typescript
// Before
function process(data: any): any { ... }

// After
function process<T>(data: T): ProcessResult<T> { ... }
```

### 완료 기준
- [ ] `libs/shared/` 내 `any` 사용 0개
- [ ] 모든 함수에 명시적 반환 타입

---

## Task 4.2: any 타입 제거 - system 도메인

### 대상
- `apps/system/*/src/`

### 작업 내용
1. DTO에 `any` 대신 구체적 타입 사용
2. Repository 메서드 반환 타입 명시
3. 외부 라이브러리 타입 정의 추가

### 완료 기준
- [ ] 3개 서비스 `any` 제거 완료

---

## Task 4.3: any 타입 제거 - hr 도메인

### 대상
- `apps/hr/*/src/`

### 완료 기준
- [ ] 3개 서비스 `any` 제거 완료

---

## Task 4.4: any 타입 제거 - finance/general 도메인

### 대상
- `apps/finance/*/src/`
- `apps/general/*/src/`

### 완료 기준
- [ ] 6개 서비스 `any` 제거 완료

---

## Task 4.5: any 타입 제거 - platform/ai 도메인

### 대상
- `apps/platform/*/src/`
- `apps/ai/*/src/`

### 완료 기준
- [ ] 5개 서비스 `any` 제거 완료

---

## Task 4.6: 공통 페이지네이션 유틸리티 추출

### 현재 상태
각 서비스에서 개별적으로 페이지네이션 구현

### 목표 구조
```
libs/shared/util/src/lib/pagination/
├── pagination.dto.ts        # PaginationDto, PaginatedResult
├── pagination.util.ts       # 페이지네이션 헬퍼 함수
└── index.ts
```

### 공통 DTO
```typescript
// pagination.dto.ts
export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit?: number = 10;
}

export class PaginatedResult<T> {
  items: T[];
  meta: {
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}
```

### 완료 기준
- [ ] `libs/shared/util`에 페이지네이션 모듈 추가
- [ ] 각 서비스에서 공통 모듈 사용으로 변경

---

## Task 4.7: 공통 API 응답 패턴 통일

### 작업 내용
1. `libs/shared/domain`의 `ApiResponseDto` 활용 확인
2. 모든 Controller에서 일관된 응답 형식 사용

### 표준 응답 형식
```typescript
{
  success: true,
  data: { ... },
  message: "조회 성공"
}

{
  success: false,
  error: {
    code: "USER_NOT_FOUND",
    message: "사용자를 찾을 수 없습니다."
  }
}
```

### 완료 기준
- [ ] 모든 서비스 응답 형식 통일

---

## 2주차: 중복 코드 제거 및 리팩토링

---

## Task 4.8: 중복 코드 제거 - Phase 1 분석 기반

### 작업 내용
1. Phase 1의 jscpd 결과 분석
2. 중복률 높은 코드 식별
3. 공통 함수/클래스로 추출

### 중복 제거 우선순위
| 우선순위 | 기준 |
|---------|------|
| 높음 | 3개 이상 서비스에서 중복 |
| 중간 | 2개 서비스에서 중복 |
| 낮음 | 동일 서비스 내 중복 |

### 완료 기준
- [ ] 높은 우선순위 중복 모두 제거
- [ ] 중간 우선순위 중복 50% 제거

---

## Task 4.9: Base Repository 패턴 도입

### 현재 상태
각 서비스에서 CRUD 로직 반복 구현

### 목표 구조
```typescript
// libs/shared/infra/src/lib/repository/base.repository.ts
export abstract class BaseRepository<T, CreateDto, UpdateDto> {
  constructor(protected readonly prisma: PrismaClient) {}

  async create(data: CreateDto): Promise<T> { ... }
  async findById(id: string): Promise<T | null> { ... }
  async findAll(filter: FilterDto): Promise<T[]> { ... }
  async update(id: string, data: UpdateDto): Promise<T> { ... }
  async delete(id: string): Promise<void> { ... }
}
```

### 완료 기준
- [ ] `BaseRepository` 클래스 구현
- [ ] 최소 3개 서비스에서 적용

---

## Task 4.10: 에러 핸들링 표준화

### 작업 내용
1. `BusinessException` 활용 확대
2. 에러 코드 상수화
3. 다국어 메시지 지원 준비

### 에러 코드 체계
```typescript
// libs/shared/domain/src/lib/error-codes.ts
export const ErrorCodes = {
  // 인증
  AUTH_INVALID_CREDENTIALS: 'AUTH_001',
  AUTH_TOKEN_EXPIRED: 'AUTH_002',
  
  // 사용자
  USER_NOT_FOUND: 'USER_001',
  USER_ALREADY_EXISTS: 'USER_002',
  
  // 비즈니스
  BUDGET_INSUFFICIENT: 'BUDGET_001',
  // ...
} as const;
```

### 완료 기준
- [ ] 에러 코드 상수 파일 생성
- [ ] 모든 예외에서 에러 코드 사용

---

## Task 4.11: Prisma 쿼리 최적화

### 작업 내용
1. N+1 쿼리 패턴 식별 및 수정
2. `include` / `select` 최적화
3. 대용량 조회 시 페이지네이션 강제

### N+1 수정 예시
```typescript
// Before (N+1)
const users = await prisma.user.findMany();
for (const user of users) {
  const dept = await prisma.department.findUnique({ where: { id: user.deptId } });
}

// After
const users = await prisma.user.findMany({
  include: { department: true }
});
```

### 완료 기준
- [ ] 모든 N+1 쿼리 제거
- [ ] 복잡한 쿼리에 `select` 적용

---

## Task 4.12: 공통 모듈 의존성 정리

### 작업 내용
1. `libs/shared/` 간 순환 참조 제거
2. 의존성 계층 명확화
3. 불필요한 의존성 제거

### 의존성 규칙
```
util (최하위) ← domain ← infra (최상위)
```

### 확인 명령어
```bash
pnpm nx graph --focus=shared-util
pnpm nx graph --focus=shared-domain
pnpm nx graph --focus=shared-infra
```

### 완료 기준
- [ ] 순환 참조 0개
- [ ] 의존성 그래프 정리 완료

---

## 📋 Phase 4 완료 체크리스트

### 1주차
- [ ] Task 4.1 ~ 4.5 완료 (any 제거)
- [ ] Task 4.6 ~ 4.7 완료 (공통 패턴)

### 2주차
- [ ] Task 4.8 완료 (중복 제거)
- [ ] Task 4.9 완료 (Base Repository)
- [ ] Task 4.10 완료 (에러 핸들링)
- [ ] Task 4.11 완료 (쿼리 최적화)
- [ ] Task 4.12 완료 (의존성 정리)
- [ ] 기술 부채 해소 보고서 생성
