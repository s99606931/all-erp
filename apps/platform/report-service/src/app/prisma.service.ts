import { INestApplication, Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaClient } from '.prisma/client';

/**
 * Report Service용 Prisma 클라이언트 서비스
 * report_db 데이터베이스에 연결합니다.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
      log: process.env.NODE_ENV !== 'production' 
        ? ['query', 'info', 'warn', 'error']
        : ['error'],
    });
  }

  /**
   * 모듈 초기화 시 데이터베이스 연결
   */
  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Report Database connected successfully');
    } catch (error) {
      this.logger.error('Failed to connect to Report Database', error);
      throw error;
    }
  }

  /**
   * 애플리케이션 종료 시 정리
   * @param app NestJS 애플리케이션 인스턴스
   */
  async enableShutdownHooks(app: INestApplication) {
    process.on('beforeExit', async () => {
      await app.close();
    });
  }
}
