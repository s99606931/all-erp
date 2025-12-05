import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';
import { join } from 'path';

/**
 * notification-service 전용 Prisma 설정
 * notification_db 데이터베이스 사용
 */
export default defineConfig({
  schema: join(__dirname, 'prisma', 'schema.prisma'),
  datasource: {
    url: env('DATABASE_URL'),
  },
});
