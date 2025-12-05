import { Test, TestingModule } from '@nestjs/testing';
import { SharedEventsModule } from './shared-events.module';
import { EventEmitterService } from './event-emitter.service';

// uuid 모킹
jest.mock('uuid');

describe('SharedEventsModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [SharedEventsModule],
    }).compile();
  });

  afterEach(async () => {
    await module.close();
  });

  it('모듈이 정상적으로 로드되어야 한다', () => {
    expect(module).toBeDefined();
  });

  it('EventEmitterService가 제공되어야 한다', () => {
    const service = module.get<EventEmitterService>(EventEmitterService);
    expect(service).toBeDefined();
    expect(service).toBeInstanceOf(EventEmitterService);
  });
});
