import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

// settlement-service 전용 Prisma 설정
// settlement_db 데이터베이스 사용
export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: env('SETTLEMENT_DATABASE_URL'),
  },
});
