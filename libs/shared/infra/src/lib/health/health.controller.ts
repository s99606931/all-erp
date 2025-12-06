import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private memory: MemoryHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      // 메모리 사용량 체크 (Heap이 150MB를 넘지 않는지)
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      // 기본 헬스 체크
      () => ({ status: { status: 'up' } }),
    ]);
  }
}
