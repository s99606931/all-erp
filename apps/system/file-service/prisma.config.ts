import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

/**
 * file-service 전용 Prisma 설정
 * file_db 데이터베이스 사용
 */
export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: env('FILE_DATABASE_URL'),
  },
});
