import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

// payroll-service 전용 Prisma 설정
// payroll_db 데이터베이스 사용
export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: env('PAYROLL_DATABASE_URL'),
  },
});
