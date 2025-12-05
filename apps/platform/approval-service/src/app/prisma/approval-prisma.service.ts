import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/approval-client';

/**
 * Approval Service 전용 Prisma 클라이언트
 * approval_db 데이터베이스에 연결합니다.
 */
@Injectable()
export class ApprovalPrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ApprovalPrismaService.name);

  constructor() {
    super({
      log: process.env['NODE_ENV'] !== 'production' 
        ? ['query', 'info', 'warn', 'error'] 
        : ['error'],
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('✅ Approval Database connected successfully');
    } catch (error) {
      this.logger.error('❌ Failed to connect to approval database', error instanceof Error ? error.stack : error);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
      this.logger.log('Approval Database disconnected');
    } catch (error) {
      this.logger.error('Failed to disconnect from approval database', error instanceof Error ? error.stack : error);
    }
  }

  /**
   * 데이터베이스 헬스 체크
   */
  async isHealthy(): Promise<boolean> {
    try {
      await this.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      this.logger.error('Approval database health check failed', error);
      return false;
    }
  }
}
