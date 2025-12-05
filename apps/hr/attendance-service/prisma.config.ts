import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

// attendance-service 전용 Prisma 설정
// attendance_db 데이터베이스 사용
export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: env('ATTENDANCE_DATABASE_URL'),
  },
});
