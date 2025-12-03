import { validateConfig } from './validate-config';

describe('validateConfig', () => {
  const validConfig = {
    NODE_ENV: 'test',
    TZ: 'Asia/Seoul',
    DB_HOST: 'localhost',
    DB_PORT: 5432,
    DB_USERNAME: 'user',
    DB_PASSWORD: 'password',
    DB_DATABASE: 'test_db',
    REDIS_HOST: 'localhost',
    REDIS_PORT: 6379,
    RABBITMQ_PORT: 5672, // RABBITMQ_PORT 기본값 추가
    AUTH_SERVICE_PORT: 3001,
    SYSTEM_SERVICE_PORT: 3002,
    TENANT_SERVICE_PORT: 3006,
    JWT_SECRET: 'secret',
    JWT_EXPIRATION: '1h',
    NEXT_PUBLIC_API_URL: 'http://localhost:3000',
  };

  it('should return config if all variables are valid', () => {
    const result = validateConfig(validConfig);
    expect(result).toEqual(validConfig);
  });

  it('should apply default values for missing optional fields', () => {
    // validateConfig는 모든 필드를 optional로 처리하고 기본값을 제공합니다
    const minimalConfig = {
      NEXT_PUBLIC_API_URL: 'http://localhost:3000',
    };
    
    const result = validateConfig(minimalConfig);
    
    // 기본값 검증
    expect(result.NODE_ENV).toBe('development');
    expect(result.TZ).toBe('Asia/Seoul');
    expect(result.DB_PORT).toBe(5432);
    expect(result.REDIS_HOST).toBe('localhost');
    expect(result.REDIS_PORT).toBe(6379);
    expect(result.RABBITMQ_PORT).toBe(5672);
    expect(result.AUTH_SERVICE_PORT).toBe(3001);
    expect(result.SYSTEM_SERVICE_PORT).toBe(3002);
    expect(result.TENANT_SERVICE_PORT).toBe(3006);
    expect(result.JWT_EXPIRATION).toBe('1h');
  });

  it('should use default values', () => {
    const configWithDefaults = {
      DB_HOST: 'localhost',
      DB_USERNAME: 'user',
      DB_PASSWORD: 'password',
      DB_DATABASE: 'test_db',
      JWT_SECRET: 'secret',
      NEXT_PUBLIC_API_URL: 'http://localhost:3000',
    };
    
    const result = validateConfig(configWithDefaults);
    expect(result.DB_PORT).toBe(5432);
    expect(result.NODE_ENV).toBe('development');
  });
});
