import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  TZ: z.string().default('Asia/Seoul'),
  
  // Database
  DB_HOST: z.string(),
  DB_PORT: z.coerce.number().default(5432),
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_DATABASE: z.string(),
  
  // Redis
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.coerce.number().default(6379),
  
  // Service Ports
  AUTH_SERVICE_PORT: z.coerce.number().default(3001),
  SYSTEM_SERVICE_PORT: z.coerce.number().default(3002),
  TENANT_SERVICE_PORT: z.coerce.number().default(3006),
  
  // Auth
  JWT_SECRET: z.string(),
  JWT_EXPIRATION: z.string().default('1h'),
  
  // Frontend
  NEXT_PUBLIC_API_URL: z.string().url(),
});

export type EnvConfig = z.infer<typeof envSchema>;

export function validateConfig(config: Record<string, unknown>): EnvConfig {
  const result = envSchema.safeParse(config);
  
  if (!result.success) {
    console.error('❌ Invalid environment variables:', result.error.format());
    throw new Error('Invalid environment variables');
  }
  
  return result.data;
}
