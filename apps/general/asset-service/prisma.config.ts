import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

/**
 * asset-service 전용 Prisma 설정
 * asset_db 데이터베이스 사용
 */
export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: env('ASSET_DATABASE_URL'),
  },
});
