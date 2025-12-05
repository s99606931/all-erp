import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

/**
 * approval-service 전용 Prisma 설정
 * approval_db 데이터베이스 사용
 */
export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: env('APPROVAL_DATABASE_URL'),
  },
});
