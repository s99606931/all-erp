import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

// auth-service 전용 Prisma 설정
// auth_db 데이터베이스 사용
export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: env('AUTH_DATABASE_URL'),
  },
});
