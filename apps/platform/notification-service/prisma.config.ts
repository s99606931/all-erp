import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

/**
 * notification-service 전용 Prisma 설정
 * notification_db 데이터베이스 사용
 */
export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: env('NOTIFICATION_DATABASE_URL'),
  },
});
