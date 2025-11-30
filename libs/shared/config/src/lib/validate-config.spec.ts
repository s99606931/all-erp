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

  it('should throw error if required variables are missing', () => {
    const invalidConfig = { ...validConfig };
    delete (invalidConfig as any).DB_HOST;
    
    expect(() => validateConfig(invalidConfig)).toThrow('Invalid environment variables');
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
