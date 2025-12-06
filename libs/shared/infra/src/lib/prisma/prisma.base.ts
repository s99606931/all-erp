import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';

/**
 * Prisma 서비스의 공통 로직을 제공하는 추상 베이스 클래스
 * 
 * 각 마이크로서비스는 이 클래스를 상속하여 자체 PrismaService를 구현합니다.
 * Database per Service 패턴을 지원하며, 서비스별로 독립적인 Prisma Client를 사용합니다.
 * 
 * @example
 * ```typescript
 * @Injectable()
 * export class PrismaService extends PrismaServiceBase {
 *   protected prismaClient: PrismaClient;
 * 
 *   constructor() {
 *     super('AuthPrismaService');
 *     this.prismaClient = new PrismaClient({
 *       
 *     });
 *   }
 * 
 *   get user() { return this.prismaClient.user; }
 * }
 * ```
 */
@Injectable()
export abstract class PrismaServiceBase implements OnModuleInit, OnModuleDestroy {
  protected readonly logger: Logger;
  protected abstract prismaClient: any;

  constructor(serviceName: string) {
    this.logger = new Logger(serviceName);
  }

  /**
   * 모듈 초기화 시 데이터베이스 연결
   */
  async onModuleInit() {
    try {
      await this.prismaClient.$connect();
      this.logger.log('Database connected successfully');
    } catch (error) {
      this.logger.error('Failed to connect to database', error instanceof Error ? error.stack : error);
      throw error;
    }
  }

  /**
   * 모듈 종료 시 데이터베이스 연결 해제
   */
  async onModuleDestroy() {
    try {
      await this.prismaClient.$disconnect();
      this.logger.log('Database disconnected successfully');
    } catch (error) {
      this.logger.error('Failed to disconnect from database', error instanceof Error ? error.stack : error);
    }
  }

  /**
   * 데이터베이스 연결 상태 확인 (Health Check)
   * @returns 연결 성공 시 true, 실패 시 false
   */
  async isHealthy(): Promise<boolean> {
    try {
      await this.prismaClient.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      this.logger.error('Database health check failed', error instanceof Error ? error.stack : error);
      return false;
    }
  }

  /**
   * 현재 요청의 테넌트 ID 설정
   * 이 메서드는 TenantMiddleware에서 호출됩니다
   * @param tenantId 테넌트 ID
   */
  setTenantId(tenantId: string): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).currentTenantId = tenantId;
  }

  /**
   * 현재 요청의 테넌트 ID 제거
   */
  clearTenantId(): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (global as any).currentTenantId;
  }
}
