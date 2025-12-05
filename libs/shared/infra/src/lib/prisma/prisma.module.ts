import { Injectable, OnModuleInit, OnModuleDestroy, Module, Global, Logger } from '@nestjs/common';

/**
 * @deprecated
 * 
 * 이 PrismaService는 더 이상 사용되지 않습니다.
 * Database per Service 패턴을 위해 각 마이크로서비스는 자체 PrismaService를 구현해야 합니다.
 * 
 * 사용 방법:
 * 1. 서비스 디렉토리에 `src/prisma.service.ts` 생성
 * 2. PrismaServiceBase를 상속하여 구현
 * 3. AppModule에서 로컬 PrismaModule import
 * 
 * @see PrismaServiceBase
 */
@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger('DeprecatedPrismaService');

  constructor() {
    this.logger.warn(
      '⚠️  공유 PrismaService는 deprecated되었습니다. 각 서비스는 자체 PrismaService를 구현해야 합니다.'
    );
  }

  async onModuleInit() {
    this.logger.warn('공유 PrismaService는 사용되지 않습니다.');
  }

  async onModuleDestroy() {
    // No-op
  }

  async isHealthy(): Promise<boolean> {
    return false;
  }
}

/**
 * @deprecated
 * 
 * 이 PrismaModule은 더 이상 사용되지 않습니다.
 * 각 마이크로서비스는 자체 PrismaModule을 구현해야 합니다.
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
