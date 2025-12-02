# Shared Infra 라이브러리

모든 마이크로서비스에서 공통으로 사용되는 인프라 관련 모듈을 제공하는 라이브러리입니다.

## 개요

`@all-erp/shared/infra` 라이브러리는 다음 기능을 제공합니다:

- **PrismaModule**: 데이터베이스 연결 및 Multi-tenancy 지원
- **LoggerModule**: Winston 기반 구조화된 로깅
- **RabbitMQModule**: 서비스 간 비동기 메시지 통신
- **TenantMiddleware**: 요청에서 테넌트 ID 추출

## 설치

라이브러리는 Nx 모노레포의 일부이므로 별도 설치가 필요 없습니다.

```typescript
import { InfraModule, PrismaService, LoggerService, RabbitMQService } from '@all-erp/shared/infra';
```

## 모듈 설명

### 1. PrismaModule

데이터베이스 연결을 관리하는 전역 모듈입니다.

**기능:**
- 자동 연결/해제 (NestJS 라이프사이클)
- 쿼리 로깅 (개발 환경)
- Multi-tenancy 지원 (tenantId 자동 필터링)
- Health check

**사용 예제:**

```typescript
import { Module } from '@nestjs/common';
import { PrismaModule } from '@all-erp/shared/infra';

@Module({
  imports: [PrismaModule],
})
export class AppModule {}
```

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@all-erp/shared/infra';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    // tenantId가 자동으로 적용됩니다
    return this.prisma.user.findMany();
  }

  async checkHealth() {
    return this.prisma.isHealthy();
  }
}
```

**환경 변수:**
```bash
DATABASE_URL=postgresql://user:password@localhost:5432/erp
NODE_ENV=development  # production일 경우 쿼리 로깅 비활성화
```

---

### 2. LoggerModule & LoggerService

Winston 기반의 구조화된 로깅을 제공합니다.

**기능:**
- JSON 포맷 로깅
- 환경별 로그 레벨 (개발: debug, 운영: info)
- 콘솔 출력 + 파일 저장 (운영 환경)
- 컨텍스트 기반 로깅

**사용 예제:**

```typescript
import { Module } from '@nestjs/common';
import { LoggerModule } from '@all-erp/shared/infra';

@Module({
  imports: [LoggerModule],
})
export class AppModule {}
```

```typescript
import { Injectable } from '@nestjs/common';
import { LoggerService } from '@all-erp/shared/infra';

@Injectable()
export class UserService {
  constructor(private readonly logger: LoggerService) {}

  async createUser(data: any) {
    this.logger.log('Creating new user', 'UserService', { email: data.email });
    
    try {
      // 사용자 생성 로직
      this.logger.log('User created successfully', 'UserService', { userId: user.id });
    } catch (error) {
      this.logger.error('Failed to create user', error.stack, 'UserService');
      throw error;
    }
  }
}
```

**환경 변수:**
```bash
NODE_ENV=development  # production일 경우 info 레벨, development일 경우 debug 레벨
SERVICE_NAME=auth-service  # 로그에 표시될 서비스 이름
```

**로그 파일 (운영 환경):**
- `logs/error.log`: 에러 로그만 저장
- `logs/combined.log`: 모든 로그 저장

---

### 3. RabbitMQModule & RabbitMQService

서비스 간 비동기 메시지 통신을 위한 RabbitMQ 연결을 관리합니다.

**기능:**
- 자동 연결 및 재연결
- Exchange 및 Queue 관리
- 메시지 발행 (Publish)
- 메시지 구독 (Subscribe)
- Health check

**사용 예제:**

```typescript
import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@all-erp/shared/infra';

@Module({
  imports: [RabbitMQModule],
})
export class AppModule {}
```

**메시지 발행:**

```typescript
import { Injectable } from '@nestjs/common';
import { RabbitMQService } from '@all-erp/shared/infra';

@Injectable()
export class UserService {
  constructor(private readonly rabbitMQ: RabbitMQService) {}

  async createUser(data: any) {
    const user = await this.userRepository.save(data);
    
    // 사용자 생성 이벤트 발행
    await this.rabbitMQ.publish(
      'user.events',  // Exchange 이름
      'user.created', // Routing key
      { userId: user.id, email: user.email } // 메시지 내용
    );
    
    return user;
  }
}
```

**메시지 구독:**

```typescript
import { Injectable, OnModuleInit } from '@nestjs/common';
import { RabbitMQService } from '@all-erp/shared/infra';

@Injectable()
export class UserEventHandler implements OnModuleInit {
  constructor(private readonly rabbitMQ: RabbitMQService) {}

  async onModuleInit() {
    // Exchange 생성
    await this.rabbitMQ.assertExchange('user.events', 'topic');
    
    // Queue 생성
    await this.rabbitMQ.assertQueue('system.user.created');
    
    // Queue를 Exchange에 바인딩
    await this.rabbitMQ.bindQueue('system.user.created', 'user.events', 'user.created');
    
    // 메시지 구독
    await this.rabbitMQ.subscribe('system.user.created', async (message: any) => {
      console.log('User created:', message);
      // 사용자 생성 이벤트 처리 로직
    });
  }
}
```

**환경 변수:**
```bash
RABBITMQ_URL=amqp://user:password@localhost:5672
```

---

### 4. TenantMiddleware

HTTP 요청에서 테넌트 ID를 추출하여 요청 객체에 설정합니다.

**기능:**
- HTTP 헤더에서 테넌트 ID 추출 (X-Tenant-ID)
- Subdomain에서 테넌트 ID 추출
- 테넌트 ID 필수 여부 설정

**사용 예제:**

```typescript
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TenantMiddleware } from '@all-erp/shared/infra';

@Module({
  // ...
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes('*');
  }
}
```

```typescript
import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller('users')
export class UserController {
  @Get()
  findAll(@Req() req: Request) {
    const tenantId = req.tenantId;
    console.log('Current tenant:', tenantId);
    // ...
  }
}
```

**환경 변수:**
```bash
REQUIRE_TENANT_ID=true  # true일 경우 테넌트 ID가 없으면 400 에러 발생
```

---

## 통합 사용 예제

모든 모듈을 함께 사용하는 예제:

```typescript
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InfraModule, TenantMiddleware } from '@all-erp/shared/infra';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    InfraModule,  // Prisma, Logger, RabbitMQ 모두 포함
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes('*');
  }
}
```

## 테스트

단위 테스트 실행:

```bash
pnpm nx test shared-infra
```

## 참고 사항

- **Multi-tenancy**: PrismaService는 `global.currentTenantId`를 사용하여 테넌트 ID를 추적합니다. TenantMiddleware와 함께 사용하세요.
- **RabbitMQ 재연결**: 최대 10회 재연결 시도, 각 시도 간 5초 대기
- **로그 파일**: 운영 환경에서는 `logs/` 디렉토리에 로그 파일이 생성됩니다. 디렉토리가 없으면 에러가 발생하므로 미리 생성해야 합니다.

## 라이센스

MIT

