# Phase 6: 성능 최적화 (1주)

> **목표**: 병목 지점 식별 및 최적화, 응답 시간 개선

---

## Task 6.1: 데이터베이스 쿼리 분석

### 작업 내용
1. Prisma 쿼리 로깅 활성화
2. 느린 쿼리 식별 (1초 이상)
3. 실행 계획 분석

### 로깅 설정
```typescript
// prisma.service.ts
const prisma = new PrismaClient({
  log: [
    { emit: 'event', level: 'query' },
    { emit: 'stdout', level: 'info' },
  ],
});

prisma.$on('query', (e) => {
  if (e.duration > 1000) {
    console.log(`⚠️ Slow Query (${e.duration}ms): ${e.query}`);
  }
});
```

### 완료 기준
- [ ] 쿼리 로깅 설정 완료
- [ ] 느린 쿼리 목록 작성

---

## Task 6.2: 인덱스 최적화

### 작업 내용
1. Task 6.1에서 식별된 느린 쿼리 분석
2. 필요한 인덱스 추가
3. 사용되지 않는 인덱스 제거

### 인덱스 추가 예시
```prisma
// schema.prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  tenantId  String
  deptId    String

  @@index([tenantId])          // 테넌트 조회
  @@index([tenantId, deptId])  // 부서별 조회
}
```

### 완료 기준
- [ ] 필요 인덱스 추가
- [ ] 마이그레이션 생성 및 적용

---

## Task 6.3: 캐싱 전략 적용

### 대상
- 자주 조회되는 마스터 데이터
- 공통 코드
- 메뉴 구조
- 테넌트 설정

### Redis 캐싱 구현
```typescript
// cache.service.ts
@Injectable()
export class CacheService {
  constructor(private readonly redis: Redis) {}

  async get<T>(key: string): Promise<T | null> {
    const data = await this.redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  async set(key: string, value: unknown, ttl: number = 300): Promise<void> {
    await this.redis.setex(key, ttl, JSON.stringify(value));
  }

  async invalidate(pattern: string): Promise<void> {
    const keys = await this.redis.keys(pattern);
    if (keys.length) await this.redis.del(...keys);
  }
}
```

### 완료 기준
- [ ] 캐싱 서비스 구현/개선
- [ ] 주요 조회 API에 캐싱 적용

---

## Task 6.4: API 응답 시간 측정

### 작업 내용
1. 요청/응답 시간 로깅 미들웨어 적용
2. 500ms 초과 API 식별
3. 개선 대상 목록 작성

### 측정 미들웨어
```typescript
// performance.middleware.ts
@Injectable()
export class PerformanceMiddleware implements NestMiddleware {
  private readonly logger = new Logger('Performance');

  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      if (duration > 500) {
        this.logger.warn(`⚠️ Slow API: ${req.method} ${req.url} - ${duration}ms`);
      }
    });
    next();
  }
}
```

### 완료 기준
- [ ] 성능 미들웨어 적용
- [ ] 느린 API 목록 작성

---

## Task 6.5: 느린 API 최적화

### 최적화 기법
| 문제 | 해결 방법 |
|------|----------|
| N+1 쿼리 | `include` 사용 |
| 대용량 조회 | 페이지네이션 필수 |
| 복잡한 계산 | 백그라운드 처리 |
| 반복 조회 | 캐싱 적용 |

### 완료 기준
- [ ] 식별된 느린 API 모두 최적화
- [ ] 500ms 이하 응답 시간 달성

---

## Task 6.6: 프론트엔드 번들 크기 최적화

### 작업 내용
1. 번들 분석
2. 코드 스플리팅 적용
3. 불필요 의존성 제거

### 분석 명령어
```bash
# 번들 크기 분석
pnpm nx build shell --stats-json
npx vite-bundle-visualizer dist/apps/frontend/shell/stats.json
```

### 최적화 기법
- 동적 import로 코드 스플리팅
- Tree shaking 확인
- 미사용 라이브러리 제거

### 완료 기준
- [ ] 초기 로드 번들 1MB 이하
- [ ] 각 Remote 앱 500KB 이하

---

## Task 6.7: 부하 테스트

### 테스트 도구
- k6 또는 Artillery

### 테스트 시나리오
```javascript
// k6 스크립트 예시
import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 100,           // 동시 사용자
  duration: '5m',     // 5분간 테스트
};

export default function() {
  const res = http.get('http://localhost:3001/api/health');
  check(res, { 'status is 200': (r) => r.status === 200 });
}
```

### 완료 기준
- [ ] 동시 사용자 1000명 지원 확인
- [ ] 평균 응답 시간 500ms 이하 확인

---

## Task 6.8: 성능 최적화 보고서 작성

### 보고서 구성
1. **개선 전/후 비교**
   - 쿼리 실행 시간
   - API 응답 시간
   - 번들 크기
2. **적용된 최적화**
   - 인덱스 추가 목록
   - 캐싱 적용 영역
   - 코드 최적화 내용
3. **성능 지표**
   - 동시 처리량
   - 평균 응답 시간
   - 에러율

### 완료 기준
- [ ] 성능 최적화 보고서 완료
- [ ] 사용자 확인 완료

---

## 📋 Phase 6 완료 체크리스트

- [ ] Task 6.1 ~ 6.2 완료 (DB 최적화)
- [ ] Task 6.3 완료 (캐싱)
- [ ] Task 6.4 ~ 6.5 완료 (API 최적화)
- [ ] Task 6.6 완료 (프론트엔드)
- [ ] Task 6.7 완료 (부하 테스트)
- [ ] Task 6.8 완료 (최종 보고서)
