import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

/**
 * AppController 단위 테스트
 */
describe('AppController', () => {
  let controller: AppController;
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    controller = module.get<AppController>(AppController);
    service = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getData', () => {
    it('should return message from service', () => {
      const expectedResult = { message: 'Hello API' };
      jest.spyOn(service, 'getData').mockReturnValue(expectedResult);

      const result = controller.getData();

      expect(result).toEqual(expectedResult);
      expect(service.getData).toHaveBeenCalled();
    });
  });
});
