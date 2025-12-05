import 'dotenv/config'
import { defineConfig, env } from "prisma/config";

// Database per Service 패턴: 서비스별 DATABASE_URL 선택
// SERVICE_NAME 환경 변수를 통해 각 서비스의 DB URL을 동적으로 선택
const getServiceDatabaseUrl = (): string => {
  const serviceName = process.env.SERVICE_NAME; // env() 대신 process.env 사용 (선택적)

  if (serviceName) {
    const serviceDbUrlKey = `${serviceName.toUpperCase().replace(/-/g, '_')}_DATABASE_URL`;
    const serviceDbUrl = process.env[serviceDbUrlKey];
    if (serviceDbUrl) {
      console.log(`✅ Using ${serviceDbUrlKey} for ${serviceName}`);
      return serviceDbUrl;
    }
  }

  // 기본값: DATABASE_URL 사용 (하위 호환성)
  const defaultUrl = env('DATABASE_URL');
  console.log(`⚠️  Using default DATABASE_URL`);
  return defaultUrl;
};

export default defineConfig({
  schema: 'libs/shared/infra/prisma/schema.prisma',
  datasource: {
    url: getServiceDatabaseUrl(),
  },
});

