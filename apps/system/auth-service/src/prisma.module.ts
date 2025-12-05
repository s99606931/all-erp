import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * Auth Service 전용 Prisma 모듈
 * 
 * 전역 모듈로 설정되어 auth-service 전체에서 PrismaService를 사용할 수 있습니다.
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
