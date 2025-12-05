import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

// system-service 전용 Prisma 설정
// system_db 데이터베이스 사용
export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: env('SYSTEM_DATABASE_URL'),
  },
});
