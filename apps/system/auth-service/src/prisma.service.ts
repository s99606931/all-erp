import { Injectable } from '@nestjs/common';
import { PrismaClient } from '.prisma/auth-client';
import { PrismaServiceBase } from '@all-erp/shared/infra';

/**
 * Auth Service 전용 Prisma 서비스
 * 
 * User, RefreshToken 모델을 관리합니다.
 * Database per Service 패턴에 따라 auth_db에 독립적으로 연결합니다.
 */
@Injectable()
export class PrismaService extends PrismaServiceBase {
  protected prismaClient: PrismaClient;

  constructor() {
    super('AuthPrismaService');
    
    this.prismaClient = new PrismaClient({
      datasourceUrl: process.env['DATABASE_URL'],
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'warn' },
      ],
    });

    // 쿼리 로깅 (개발 환경에서만)
    if (process.env['NODE_ENV'] !== 'production') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.prismaClient.$on('query' as never, (e: any) => {
        this.logger.debug(`Query: ${e.query} | Duration: ${e.duration}ms`);
      });
    }

    // 에러 로깅
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.prismaClient.$on('error' as never, (e: any) => {
      this.logger.error(`Prisma Error: ${e.message}`, e.target);
    });

    // 경고 로깅
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.prismaClient.$on('warn' as never, (e: any) => {
      this.logger.warn(`Prisma Warning: ${e.message}`);
    });
  }

  // PrismaClient 모델들을 직접 노출
  get user() {
    return this.prismaClient.user;
  }

  get refreshToken() {
    return this.prismaClient.refreshToken;
  }

  // Prisma 메서드들 노출
  get $queryRaw() {
    return this.prismaClient.$queryRaw.bind(this.prismaClient);
  }

  get $connect() {
    return this.prismaClient.$connect.bind(this.prismaClient);
  }

  get $disconnect() {
    return this.prismaClient.$disconnect.bind(this.prismaClient);
  }
}
