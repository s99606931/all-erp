import { DynamicModule, Module, Global, Provider } from '@nestjs/common';
import { RabbitMQModule } from '../rabbitmq/rabbitmq.module';
import { EventService, OUTBOX_REPO } from './event.service';
import { OutboxRelay } from './outbox.relay';

@Global()
@Module({})
export class EventModule {
  /**
   * EventModule 초기화
   * @param options.repositoryProvider PrismaService 클래스 또는 Provider
   */
  static forRoot(options: { repositoryProvider: any }): DynamicModule {
    const providers: Provider[] = [
      {
        provide: OUTBOX_REPO,
        useExisting: options.repositoryProvider, // useExisting을 사용하여 이미 등록된 PrismaService 인스턴스를 재사용
      },
      EventService,
      OutboxRelay,
    ];

    return {
      module: EventModule,
      imports: [RabbitMQModule],
      providers: providers,
      exports: [EventService, OutboxRelay],
    };
  }
}
