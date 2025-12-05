import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

// budget-service 전용 Prisma 설정
// budget_db 데이터베이스 사용
export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: env('BUDGET_DATABASE_URL'),
  },
});
