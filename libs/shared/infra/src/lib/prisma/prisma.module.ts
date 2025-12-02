import { Injectable, OnModuleInit, OnModuleDestroy, Module, Global, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * Prisma 데이터베이스 클라이언트 서비스
 * 
 * 모든 마이크로서비스에서 공통으로 사용되는 데이터베이스 연결을 관리합니다.
 * - 자동 연결/해제 (NestJS 라이프사이클)
 * - 쿼리 로깅 (개발 환경)
 * - 에러 로깅
 * - Multi-tenancy 지원 (tenantId 자동 필터링)
 * - Health check 기능
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'warn' },
      ],
    });

    // 쿼리 로깅 (개발 환경에서만)
    if (process.env['NODE_ENV'] !== 'production') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.$on('query' as never, (e: any) => {
        this.logger.debug(`Query: ${e.query} | Duration: ${e.duration}ms`);
      });
    }

    // 에러 로깅
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.$on('error' as never, (e: any) => {
      this.logger.error(`Prisma Error: ${e.message}`, e.target);
    });

    // 경고 로깅
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.$on('warn' as never, (e: any) => {
      this.logger.warn(`Prisma Warning: ${e.message}`);
    });

    // Multi-tenancy 미들웨어 설정
    // 모든 쿼리에 tenantId 필터를 자동으로 추가합니다
    // 주의: 이 기능을 사용하려면 각 모델에 tenantId 필드가 있어야 합니다
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.$use(async (params: any, next: any) => {
      // tenantId가 설정된 경우에만 필터 추가
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const tenantId = (global as any).currentTenantId;
      
      if (tenantId && params.model) {
        // Read 쿼리 (findMany, findUnique 등)
        if (['findMany', 'findFirst', 'findUnique', 'count', 'aggregate'].includes(params.action)) {
          params.args = params.args || {};
          params.args.where = params.args.where || {};
          params.args.where.tenantId = tenantId;
        }
        
        // Write 쿼리 (create, update, delete 등)
        if (['create', 'createMany'].includes(params.action)) {
          params.args = params.args || {};
          if (params.action === 'create') {
            params.args.data = params.args.data || {};
            params.args.data.tenantId = tenantId;
          } else if (params.action === 'createMany') {
            if (Array.isArray(params.args.data)) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              params.args.data = params.args.data.map((item: any) => ({
                ...item,
                tenantId,
              }));
            }
          }
        }
      }

      return next(params);
    });
  }

  /**
   * 모듈 초기화 시 데이터베이스 연결
   */
  async onModuleInit() {
    try {
      await this.$connect();
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
      await this.$disconnect();
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
      await this.$queryRaw`SELECT 1`;
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

/**
 * Prisma 모듈
 * 
 * 전역 모듈로 설정되어 애플리케이션 전체에서 PrismaService를 사용할 수 있습니다.
 * 다른 모듈에서 별도로 import 하지 않아도 됩니다.
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
