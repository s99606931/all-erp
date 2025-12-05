import { Injectable } from '@nestjs/common';
import { BaseHttpClient } from './base-http.client';
import { getServiceApiPath } from './service-endpoints';

/**
 * 직원 정보 DTO
 */
export interface EmployeeDto {
  id: number;
  employeeNumber: string;
  name: string;
  email: string;
  departmentId: number;
  positionId: number;
  hireDate: Date;
  status: string;
}

/**
 * 부서 정보 DTO
 */
export interface DepartmentDto {
  id: number;
  code: string;
  name: string;
  managerId?: number;
}

/**
 * 직급 정보 DTO
 */
export interface PositionDto {
  id: number;
  code: string;
  name: string;
  level: number;
}

/**
 * Personnel Service 클라이언트
 * 
 * 직원, 부서, 직급 정보조회를 위한 API 클라이언트
 */
@Injectable()
export class PersonnelServiceClient {
  constructor(private readonly httpClient: BaseHttpClient) {}

  /**
   * 직원 정보 조회
   */
  async getEmployee(employeeId: number, tenantId: number): Promise<EmployeeDto> {
    const url = getServiceApiPath('PERSONNEL_SERVICE', `/employees/${employeeId}`);
    return this.httpClient.get<EmployeeDto>(url, {
      headers: { 'X-Tenant-ID': tenantId.toString() },
    });
  }

  /**
   * 직원 목록 조회
   */
  async getEmployees(
    tenantId: number,
    params?: { departmentId?: number; status?: string }
  ): Promise<EmployeeDto[]> {
    const url = getServiceApiPath('PERSONNEL_SERVICE', '/employees');
    return this.httpClient.get<EmployeeDto[]>(url, {
      headers: { 'X-Tenant-ID': tenantId.toString() },
      params,
    });
  }

  /**
   * 부서 정보 조회
   */
  async getDepartment(departmentId: number, tenantId: number): Promise<DepartmentDto> {
    const url = getServiceApiPath('PERSONNEL_SERVICE', `/departments/${departmentId}`);
    return this.httpClient.get<DepartmentDto>(url, {
      headers: { 'X-Tenant-ID': tenantId.toString() },
    });
  }

  /**
   * 부서 목록 조회
   */
  async getDepartments(tenantId: number): Promise<DepartmentDto[]> {
    const url = getServiceApiPath('PERSONNEL_SERVICE', '/departments');
    return this.httpClient.get<DepartmentDto[]>(url, {
      headers: { 'X-Tenant-ID': tenantId.toString() },
    });
  }

  /**
   * 직급 정보 조회
   */
  async getPosition(positionId: number, tenantId: number): Promise<PositionDto> {
    const url = getServiceApiPath('PERSONNEL_SERVICE', `/positions/${positionId}`);
    return this.httpClient.get<PositionDto>(url, {
      headers: { 'X-Tenant-ID': tenantId.toString() },
    });
  }

  /**
   * 직급 목록 조회
   */
  async getPositions(tenantId: number): Promise<PositionDto[]> {
    const url = getServiceApiPath('PERSONNEL_SERVICE', '/positions');
    return this.httpClient.get<PositionDto[]>(url, {
      headers: { 'X-Tenant-ID': tenantId.toString() },
    });
  }
}
