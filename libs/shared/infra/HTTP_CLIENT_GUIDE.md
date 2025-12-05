# HTTP 클라이언트 모듈 사용 가이드

## 개요

서비스 간 HTTP 통신을 위한 공통 모듈입니다.
타임아웃, 재시도, 로깅, 에러 처리 등의 기능을 제공합니다.

## 설치

이미 `@all-erp/shared/infra`에 포함되어 있습니다.

```bash
# 필요한 패키지는 이미 설치됨
@nestjs/axios
axios
```

## 사용 방법

### 1. 모듈 Import

```typescript
import { Module } from '@nestjs/common';
import { HttpClientModule } from '@all-erp/shared/infra';

@Module({
  imports: [HttpClientModule],
  // ...
})
export class YourModule {}
```

### 2. 서비스별 클라이언트 사용

#### Personnel Service 클라이언트

```typescript
import { Injectable } from '@nestjs/common';
import { PersonnelServiceClient } from '@all-erp/shared/infra';

@Injectable()
export class PayrollCalculationService {
  constructor(private readonly personnelClient: PersonnelServiceClient) {}

  async calculatePayroll(employeeId: number, tenantId: number) {
    // 직원 정보 조회
    const employee = await this.personnelClient.getEmployee(employeeId, tenantId);

    // 부서 정보 조회
    const department = await this.personnelClient.getDepartment(employee.departmentId, tenantId);

    // 급여 계산 로직...
  }
}
```

#### Budget Service 클라이언트

```typescript
import { Injectable } from '@nestjs/common';
import { BudgetServiceClient } from '@all-erp/shared/infra';

@Injectable()
export class ExpenseService {
  constructor(private readonly budgetClient: BudgetServiceClient) {}

  async createExpense(budgetId: number, amount: number, tenantId: number) {
    // 예산 집행 가능 여부 확인
    const { available, remainingAmount } = await this.budgetClient.checkBudgetAvailability(budgetId, amount, tenantId);

    if (!available) {
      throw new Error(`예산 부족: 잔액 ${remainingAmount}원`);
    }

    // 지출 생성 로직...
  }
}
```

#### Approval Service 클라이언트

```typescript
import { Injectable } from '@nestjs/common';
import { ApprovalServiceClient } from '@all-erp/shared/infra';

@Injectable()
export class BudgetService {
  constructor(private readonly approvalClient: ApprovalServiceClient) {}

  async requestBudgetApproval(budgetId: number, tenantId: number) {
    // 결재 요청 생성
    const approval = await this.approvalClient.createApprovalRequest(
      {
        documentType: 'BUDGET',
        documentId: budgetId,
        title: '2024년 예산 승인 요청',
        approverIds: [1, 2, 3],
        urgency: 'HIGH',
      },
      tenantId,
    );

    return approval;
  }
}
```

### 3. 기본 HTTP 클라이언트 직접 사용

특정 서비스 클라이언트가 없는 경우 BaseHttpClient를 직접 사용할 수 있습니다:

```typescript
import { Injectable } from '@nestjs/common';
import { BaseHttpClient } from '@all-erp/shared/infra';

@Injectable()
export class CustomService {
  constructor(private readonly httpClient: BaseHttpClient) {}

  async customApiCall() {
    // GET 요청
    const data = await this.httpClient.get<YourDataType>('http://custom-service:3000/api/v1/data', {
      headers: { 'X-Tenant-ID': '1' },
      params: { key: 'value' },
    });

    // POST 요청
    const result = await this.httpClient.post<ResultType>(
      'http://custom-service:3000/api/v1/create',
      { name: 'test' },
      { headers: { 'X-Tenant-ID': '1' } },
    );

    return result;
  }
}
```

## 주요 기능

### 1. 자동 재시도

네트워크 오류나 5xx 서버 에러 시 자동으로 재시도합니다:

- 기본 재시도 횟수: 3회
- 재시도 간격: 1초
- 재시도 조건: 타임아웃, 네트워크 오류, 5xx 에러

### 2. 타임아웃

기본 타임아웃은 5초입니다. 필요 시 설정 변경 가능:

```typescript
const data = await this.httpClient.get<DataType>(url, {
  timeout: 10000, // 10초
});
```

### 3. 로깅

모든 HTTP 요청/응답이 자동으로 로깅됩니다:

```
[HTTP Request] GET http://personnel-service:3011/api/v1/employees/1
[HTTP Response] GET http://personnel-service:3011/api/v1/employees/1 { status: 200, duration: '125ms' }
```

### 4. 에러 처리

HTTP 에러가 발생하면 상세한 에러 정보가 로깅됩니다:

```
[HTTP Response Error] {
  url: 'http://personnel-service:3011/api/v1/employees/999',
  method: 'get',
  status: 404,
  data: { error: 'Employee not found' }
}
```

## 환경 변수

서비스 엔드포인트는 환경 변수로 설정할 수 있습니다:

```bash
# .env 파일
PERSONNEL_SERVICE_URL=http://personnel-service:3011
BUDGET_SERVICE_URL=http://budget-service:3021
APPROVAL_SERVICE_URL=http://approval-service:3050
# ... 기타 서비스
```

환경 변수가 없으면 기본값(localhost)을 사용합니다.

## 사용 가능한 서비스 클라이언트

| 클라이언트                  | 설명                | 주요 메서드                             |
| --------------------------- | ------------------- | --------------------------------------- |
| `PersonnelServiceClient`    | 직원/부서/직급 조회 | getEmployee, getDepartment, getPosition |
| `BudgetServiceClient`       | 예산 조회 및 집행   | getBudget, checkBudgetAvailability      |
| `ApprovalServiceClient`     | 결재 문서 관리      | createApprovalRequest, approveDocument  |
| `FileServiceClient`         | 파일 관리           | requestUploadUrl, getDownloadUrl        |
| `NotificationServiceClient` | 알림 발송           | sendNotification, getUserNotifications  |

## 주의사항

⚠️ **중요**

- 모든 API 호출 시 `X-Tenant-ID` 헤더를 반드시 포함해야 합니다
- 네트워크 오류 시 재시도되므로 멱등성을 보장해야 합니다
- 타임아웃은 적절히 설정하여 무한 대기를 방지하세요
