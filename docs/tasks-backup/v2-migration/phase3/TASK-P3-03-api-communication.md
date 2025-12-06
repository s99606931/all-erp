# TASK-P3-03: HTTP API 통신 구현

## 📋 작업 개요
- **Phase**: Phase 3
- **예상 시간**: 1주
- **우선순위**: High
- **선행 작업**: TASK-P3-02

## 🎯 목표

서비스 간 동기 HTTP API 통신을 구현합니다.

## 📝 상세 작업 내용

### 1. HTTP 클라이언트 공통 모듈

**libs/shared/infra/src/lib/http/service-client.ts**:
```typescript
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ServiceClient {
  constructor(private httpService: HttpService) {}

  async getEmployee(employeeId: number) {
    const { data } = await this.httpService.get(
      `http://personnel-service:3011/api/v1/employees/${employeeId}`
    ).toPromise();
    return data;
  }

  async getBudget(budgetId: number) {
    const { data } = await this.httpService.get(
      `http://budget-service:3021/api/v1/budgets/${budgetId}`
    ).toPromise();
    return data;
  }
}
```

## ✅ 완료 조건

- [ ] ServiceClient 모듈 구현
- [ ] 주요 서비스 간 API 호출 10개 이상
- [ ] 에러 처리 및 재시도 로직
- [ ] 타임아웃 설정

## 🔧 실행 명령어

```bash
# 통합 테스트
pnpm test:integration
```
