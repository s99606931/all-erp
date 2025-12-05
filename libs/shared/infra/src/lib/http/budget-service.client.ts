import { Injectable } from '@nestjs/common';
import { BaseHttpClient } from './base-http.client';
import { getServiceApiPath } from './service-endpoints';

/**
 * 예산 정보 DTO
 */
export interface BudgetDto {
  id: number;
  year: number;
  departmentId: number;
  categoryId: number;
  totalAmount: number;
  executedAmount: number;
  remainingAmount: number;
  status: string;
}

/**
 * 예산 집행 내역 DTO
 */
export interface BudgetExecutionDto {
  id: number;
  budgetId: number;
  executionDate: Date;
  amount: number;
  description: string;
  executedBy: number;
}

/**
 * Budget Service 클라이언트
 * 
 * 예산 정보 및 집행 내역 조회를 위한 API 클라이언트
 */
@Injectable()
export class BudgetServiceClient {
  constructor(private readonly httpClient: BaseHttpClient) {}

  /**
   * 예산 정보 조회
   */
  async getBudget(budgetId: number, tenantId: number): Promise<BudgetDto> {
    const url = getServiceApiPath('BUDGET_SERVICE', `/budgets/${budgetId}`);
    return this.httpClient.get<BudgetDto>(url, {
      headers: { 'X-Tenant-ID': tenantId.toString() },
    });
  }

  /**
   * 부서별 예산 조회
   */
  async getBudgetsByDepartment(
    departmentId: number,
    year: number,
    tenantId: number
  ): Promise<BudgetDto[]> {
    const url = getServiceApiPath('BUDGET_SERVICE', '/budgets');
    return this.httpClient.get<BudgetDto[]>(url, {
      headers: { 'X-Tenant-ID': tenantId.toString() },
      params: { departmentId, year },
    });
  }

  /**
   * 예산 집행 가능 여부 확인
   */
  async checkBudgetAvailability(
    budgetId: number,
    amount: number,
    tenantId: number
  ): Promise<{ available: boolean; remainingAmount: number }> {
    const url = getServiceApiPath('BUDGET_SERVICE', `/budgets/${budgetId}/check-availability`);
    return this.httpClient.post(url, { amount }, {
      headers: { 'X-Tenant-ID': tenantId.toString() },
    });
  }

  /**
   * 예산 집행 내역 조회
   */
  async getBudgetExecutions(
    budgetId: number,
    tenantId: number
  ): Promise<BudgetExecutionDto[]> {
    const url = getServiceApiPath('BUDGET_SERVICE', `/budgets/${budgetId}/executions`);
    return this.httpClient.get<BudgetExecutionDto[]>(url, {
      headers: { 'X-Tenant-ID': tenantId.toString() },
    });
  }
}
