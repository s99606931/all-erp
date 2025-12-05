import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

/**
 * general-affairs-service 전용 Prisma 설정
 * general_affairs_db 데이터베이스 사용
 */
export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: env('GENERAL_AFFAIRS_DATABASE_URL'),
  },
});
