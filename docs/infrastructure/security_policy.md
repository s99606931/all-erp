# 보안 정책 (Security Policy)

본 문서는 ALL-ERP 시스템의 보안 설정, SSL/TLS 인증서 관리, 방화벽 규칙 및 보안 베스트 프랙티스를 정의합니다.

## 1. SSL/TLS 인증서 관리

### 1.1 인증서 발급 전략

**개발 환경**:
- 자체 서명 인증서 (Self-signed Certificate)
- 또는 Let's Encrypt (자동 갱신)

**운영 환경**:
- 공인 인증서 (CA 발급)
- Let's Encrypt (무료, 자동 갱신) 권장

### 1.2 Let's Encrypt 설정 (Certbot)

```bash
# Certbot 설치
sudo apt-get install certbot

# Nginx용 인증서 발급
sudo certbot --nginx -d app.all-erp.com -d api.all-erp.com

# 자동 갱신 설정 (Cron)
0 3 * * * certbot renew --quiet
```

### 1.3 와일드카드 인증서

```bash
# DNS 인증 방식 (*.all-erp.com)
certbot certonly --manual --preferred-challenges dns -d "*.all-erp.com"
```

### 1.4 인증서 위치 (Docker Volume Mount)

```yaml
# docker-compose.yml
services:
  gateway:
    volumes:
      - /etc/letsencrypt:/etc/letsencrypt:ro
```

---

## 2. 네트워크 보안

### 2.1 방화벽 규칙 (iptables/ufw)

**외부 접근 허용 포트**:
```bash
# HTTPS (API Gateway, Web Admin)
sudo ufw allow 443/tcp

# HTTP (리다이렉트용)
sudo ufw allow 80/tcp

# SSH (제한적 접근)
sudo ufw allow from 10.0.0.0/24 to any port 22
```

**내부 통신만 허용**:
```bash
# PostgreSQL (컨테이너 간 통신만 허용)
sudo ufw deny 5432/tcp

# Redis
sudo ufw deny 6379/tcp

# RabbitMQ
sudo ufw deny 5672/tcp
```

### 2.2 Kubernetes Network Policy

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: deny-external-access-to-db
spec:
  podSelector:
    matchLabels:
      app: postgres
  policyTypes:
  - Ingress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          tier: backend
```

---

## 3. 인증 및 인가

### 3.1 JWT 보안

**Best Practices**:
1. **Secret 강도**: 최소 32자 이상, 랜덤 생성
2. **만료 시간**: Access Token 1시간, Refresh Token 7일
3. **Refresh Token Rotation**: 사용 즉시 무효화 및 재발급
4. **Signature Algorithm**: HS256 또는 RS256

**구현 예시 (NestJS)**:
```typescript
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '1h',
        algorithm: 'HS256',
      },
    }),
  ],
})
export class AuthModule {}
```

### 3.2 RBAC (Role-Based Access Control)

**역할 정의**:
- `SUPER_ADMIN`: 시스템 전체 관리
- `TENANT_ADMIN`: 테넌트 내 모든 권한
- `MANAGER`: 부서 관리자
- `USER`: 일반 사용자

**권한 검사 Guard**:
```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('TENANT_ADMIN')
@Get('/admin/users')
async getUsers() {
  // ...
}
```

---

## 4. 데이터 암호화

### 4.1 저장 데이터 암호화 (At Rest)

**PostgreSQL**:
- 전체 디스크 암호화 (LUKS)
- 또는 Transparent Data Encryption (TDE)

**MinIO**:
- Server-Side Encryption (SSE-S3)
- 또는 Client-Side Encryption

### 4.2 전송 데이터 암호화 (In Transit)

- 모든 HTTP 통신은 **HTTPS (TLS 1.2+)** 강제
- 내부 서비스 간 통신도 TLS 사용 권장 (Service Mesh)

### 4.3 민감 정보 암호화

**비밀번호**:
- Argon2 (권장) 또는 bcrypt
- Salt Rounds: 최소 10

```typescript
import * as argon2 from 'argon2';

// 해싱
const hashedPassword = await argon2.hash(plainPassword);

// 검증
const isValid = await argon2.verify(hashedPassword, plainPassword);
```

**개인정보 (주민등록번호 등)**:
- AES-256-GCM 암호화
- 암호화 키는 환경 변수 또는 KMS (Key Management Service) 사용

---

## 5. API 보안

### 5.1 Rate Limiting

**Nginx 설정**:
```nginx
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=100r/m;

server {
    location /api/ {
        limit_req zone=api_limit burst=20 nodelay;
        proxy_pass http://backend;
    }
}
```

**NestJS Throttler**:
```typescript
@ThrottlerModule.forRoot({
  ttl: 60,      // 60초
  limit: 100,   // 100 요청
})
```

### 5.2 CORS 설정

```typescript
app.enableCors({
  origin: ['https://app.all-erp.com', 'https://admin.all-erp.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
});
```

### 5.3 Input Validation

```typescript
// DTO 검증
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
```

---

## 6. Docker 보안

### 6.1 이미지 스캔

```bash
# Trivy를 사용한 취약점 스캔
trivy image erp-auth:latest
```

### 6.2 Non-root 사용자 실행

```dockerfile
# Dockerfile
FROM node:22-alpine

# 비-root 사용자 생성
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

USER appuser

CMD ["node", "dist/main.js"]
```

### 6.3 읽기 전용 파일 시스템

```yaml
# docker-compose.yml
services:
  auth-service:
    read_only: true
    tmpfs:
      - /tmp
```

---

## 7. 로깅 및 감사

### 7.1 보안 이벤트 로깅

**필수 로깅 항목**:
- 로그인 성공/실패
- 권한 변경
- 민감 데이터 접근
- API 오류 (401, 403, 500)

### 7.2 로그 보관 정책

- **보관 기간**: 최소 1년
- **저장 위치**: ELK Stack (암호화된 스토리지)
- **접근 제어**: 보안 담당자만 접근 가능

---

## 8. 취약점 관리

### 8.1 정기 보안 스캔

| 도구 | 용도 | 주기 |
|------|------|------|
| **Snyk** | 의존성 취약점 스캔 | 매주 |
| **OWASP ZAP** | 웹 애플리케이션 스캔 | 월 1회 |
| **Trivy** | Docker 이미지 스캔 | CI/CD 파이프라인 |

### 8.2 패치 관리

- **Critical**: 24시간 이내 적용
- **High**: 7일 이내 적용
- **Medium/Low**: 월간 패치 주기

---

## 9. 접근 제어

### 9.1 SSH 접근

```bash
# 비밀번호 인증 비활성화
PasswordAuthentication no

# 루트 로그인 금지
PermitRootLogin no

# 허용된 사용자만 접근
AllowUsers admin@10.0.0.0/24
```

### 9.2 Database 접근

```sql
-- PostgreSQL: 특정 IP만 허용
# pg_hba.conf
host    all    all    10.0.0.0/24    md5
```

### 9.3 2FA (Two-Factor Authentication)

- 관리자 계정은 2FA 필수
- Google Authenticator 또는 SMS 인증

---

## 10. 보안 체크리스트

### 개발 단계
- [ ] 모든 API에 인증/인가 적용
- [ ] Input Validation 구현
- [ ] SQL Injection 방어 (Prisma ORM 사용)
- [ ] XSS 방어 (CSP 헤더 설정)

### 배포 단계
- [ ] SSL/TLS 인증서 적용
- [ ] 환경 변수 암호화 (Secrets)
- [ ] 방화벽 규칙 설정
- [ ] 보안 스캔 실행

### 운영 단계
- [ ] 주간 취약점 스캔
- [ ] 월간 보안 로그 검토
- [ ] 분기별 모의 해킹 (Penetration Test)
- [ ] 연간 보안 감사 (Security Audit)
