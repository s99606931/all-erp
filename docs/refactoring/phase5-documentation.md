# Phase 5: 문서화 강화 (1주)

> **목표**: API 문서 및 코드 문서 표준화

---

## Task 5.1: Swagger API 문서 - system 도메인

### 대상
- `apps/system/auth-service`
- `apps/system/system-service`
- `apps/system/tenant-service`

### 작업 항목
| 항목 | 데코레이터 | 작업 |
|------|-----------|------|
| 엔드포인트 그룹화 | `@ApiTags()` | [ ] |
| 요청 DTO 설명 | `@ApiProperty()` | [ ] |
| 응답 예시 | `@ApiResponse()` | [ ] |
| 인증 필요 표시 | `@ApiBearerAuth()` | [ ] |

### Swagger 데코레이터 예시
```typescript
@ApiTags('인증')
@Controller('auth')
export class AuthController {
  
  @Post('login')
  @ApiOperation({ summary: '로그인', description: '사용자 인증 후 JWT 토큰 발급' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: '로그인 성공', type: TokenResponseDto })
  @ApiResponse({ status: 401, description: '인증 실패' })
  async login(@Body() dto: LoginDto) { ... }
}
```

### 완료 기준
- [ ] 3개 서비스 Swagger 데코레이터 완료
- [ ] Swagger UI에서 한글 설명 확인

---

## Task 5.2: Swagger API 문서 - hr 도메인

### 대상
- `apps/hr/personnel-service`
- `apps/hr/payroll-service`
- `apps/hr/attendance-service`

### 완료 기준
- [ ] 3개 서비스 Swagger 데코레이터 완료

---

## Task 5.3: Swagger API 문서 - finance 도메인

### 대상
- `apps/finance/budget-service`
- `apps/finance/accounting-service`
- `apps/finance/settlement-service`

### 완료 기준
- [ ] 3개 서비스 Swagger 데코레이터 완료

---

## Task 5.4: Swagger API 문서 - general/platform/ai 도메인

### 대상
- `apps/general/*`
- `apps/platform/*`
- `apps/ai/*`

### 완료 기준
- [ ] 나머지 서비스 Swagger 데코레이터 완료

---

## Task 5.5: 공통 라이브러리 README 작성

### 대상
| 라이브러리 | README 경로 |
|-----------|------------|
| util | `libs/shared/util/README.md` |
| domain | `libs/shared/domain/README.md` |
| infra | `libs/shared/infra/README.md` |
| events | `libs/shared/events/README.md` |
| tenancy | `libs/shared/tenancy/README.md` |
| config | `libs/shared/config/README.md` |

### README 구성
1. 라이브러리 목적
2. 설치/사용 방법
3. 주요 함수/클래스 목록
4. 예제 코드

### 완료 기준
- [ ] 6개 라이브러리 README 완료

---

## Task 5.6: 각 서비스 README 작성

### README 구성
```markdown
# [서비스명]

## 개요
서비스 설명

## 기술 스택
- NestJS, Prisma 등

## 실행 방법
로컬 실행, Docker 실행

## API 엔드포인트
주요 API 목록

## 환경 변수
필요한 환경 변수 목록

## 테스트
테스트 실행 방법
```

### 완료 기준
- [ ] 17개 서비스 README 완료

---

## Task 5.7: 아키텍처 문서 업데이트

### 대상
- `docs/architecture/*`

### 작업 내용
1. 리팩토링 결과 반영
2. 변경된 구조 다이어그램 업데이트
3. 새로운 패턴/컨벤션 추가

### 완료 기준
- [ ] 아키텍처 문서 최신화

---

## Task 5.8: 개발 가이드 업데이트

### 대상
- `docs/ai/` (AI 가이드)
- `docs/guides/` (개발 가이드)

### 작업 내용
1. 리팩토링으로 변경된 내용 반영
2. 새로운 공통 패턴 사용 가이드 추가
3. 베스트 프랙티스 업데이트

### 완료 기준
- [ ] AI 가이드 최신화
- [ ] 개발 가이드 최신화

---

## 📋 Phase 5 완료 체크리스트

- [ ] Task 5.1 ~ 5.4 완료 (Swagger)
- [ ] Task 5.5 ~ 5.6 완료 (README)
- [ ] Task 5.7 ~ 5.8 완료 (가이드)
- [ ] 문서화 완료 보고서 생성
