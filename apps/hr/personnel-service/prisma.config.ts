import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

// personnel-service 전용 Prisma 설정
// personnel_db 데이터베이스 사용
export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: env('PERSONNEL_DATABASE_URL'),
  },
});
