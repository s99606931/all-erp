import { z } from 'zod';

// 공통 Base Schema (모든 서비스에서 사용)
const baseEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  TZ: z.string().default('Asia/Seoul'),
});

// Backend 서비스용 Schema (NestJS 마이크로서비스)
const backendEnvSchema = baseEnvSchema.extend({
  // Database
  DB_HOST: z.string().optional(),
  DB_PORT: z.coerce.number().default(5432),
  DB_USERNAME: z.string().optional(),
  DB_PASSWORD: z.string().optional(),
  DB_DATABASE: z.string().optional(),
  
  // Redis
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.coerce.number().default(6379),
  
  // RabbitMQ
  RABBITMQ_HOST: z.string().optional(),
  RABBITMQ_PORT: z.coerce.number().default(5672),
  
  // Service Ports
  PORT: z.coerce.number().optional(),
  AUTH_SERVICE_PORT: z.coerce.number().default(3001),
  SYSTEM_SERVICE_PORT: z.coerce.number().default(3002),
  TENANT_SERVICE_PORT: z.coerce.number().default(3006),
  
  // Auth
  JWT_SECRET: z.string().optional(),
  JWT_EXPIRATION: z.string().default('1h'),
});

// Frontend 서비스용 Schema (Next.js)
const frontendEnvSchema = baseEnvSchema.extend({
  // Frontend
  NEXT_PUBLIC_API_URL: z.string().url(),
  PORT: z.coerce.number().default(4200),
});

// 전체 Schema (모든 변수 optional - 유연성 제공)
export const envSchema = baseEnvSchema.extend({
  // Database (optional)
  DB_HOST: z.string().optional(),
  DB_PORT: z.coerce.number().default(5432),
  DB_USERNAME: z.string().optional(),
  DB_PASSWORD: z.string().optional(),
  DB_DATABASE: z.string().optional(),
  
  // Redis (optional)
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.coerce.number().default(6379),
  
  // RabbitMQ (optional)
  RABBITMQ_HOST: z.string().optional(),
  RABBITMQ_PORT: z.coerce.number().default(5672),
  
  // Service Ports
  PORT: z.coerce.number().optional(),
  AUTH_SERVICE_PORT: z.coerce.number().default(3001),
  SYSTEM_SERVICE_PORT: z.coerce.number().default(3002),
  TENANT_SERVICE_PORT: z.coerce.number().default(3006),
  
  // Auth (optional)
  JWT_SECRET: z.string().optional(),
  JWT_EXPIRATION: z.string().default('1h'),
  
  // Frontend (optional)
  NEXT_PUBLIC_API_URL: z.string().url().optional(),
});

export type EnvConfig = z.infer<typeof envSchema>;
export type BackendEnvConfig = z.infer<typeof backendEnvSchema>;
export type FrontendEnvConfig = z.infer<typeof frontendEnvSchema>;

// 기본 검증 함수 (모든 서비스용 - 유연함)
export function validateConfig(config: Record<string, unknown>): EnvConfig {
  const result = envSchema.safeParse(config);
  
  if (!result.success) {
    console.error('❌ Invalid environment variables:', result.error.format());
    throw new Error('Invalid environment variables');
  }
  
  return result.data;
}

// Backend 전용 검증 함수 (엄격한 검증)
export function validateBackendConfig(config: Record<string, unknown>): BackendEnvConfig {
  const result = backendEnvSchema.safeParse(config);
  
  if (!result.success) {
    console.error('❌ Invalid backend environment variables:', result.error.format());
    throw new Error('Invalid backend environment variables');
  }
  
  return result.data;
}

// Frontend 전용 검증 함수 (엄격한 검증)
export function validateFrontendConfig(config: Record<string, unknown>): FrontendEnvConfig {
  const result = frontendEnvSchema.safeParse(config);
  
  if (!result.success) {
    console.error('❌ Invalid frontend environment variables:', result.error.format());
    throw new Error('Invalid frontend environment variables');
  }
  
  return result.data;
}
