import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

// tenant-service 전용 Prisma 설정
// tenant_db 데이터베이스 사용
export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: env('TENANT_DATABASE_URL'),
  },
});
