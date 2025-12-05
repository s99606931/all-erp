import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

/**
 * supply-service 전용 Prisma 설정
 * supply_db 데이터베이스 사용
 */
export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: env('SUPPLY_DATABASE_URL'),
  },
});
