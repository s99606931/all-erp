import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';

/**
 * AppService 단위 테스트
 */
describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getData', () => {
    it('should return welcome message', () => {
      const result = service.getData();

      expect(result).toEqual({ message: 'Hello API' });
    });

    it('should return object with message property', () => {
      const result = service.getData();

      expect(result).toHaveProperty('message');
      expect(typeof result.message).toBe('string');
    });
  });
});
