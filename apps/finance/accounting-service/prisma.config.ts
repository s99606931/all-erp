import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

// accounting-service 전용 Prisma 설정
// accounting_db 데이터베이스 사용
export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: env('ACCOUNTING_DATABASE_URL'),
  },
});
