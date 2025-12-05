import { Injectable } from '@nestjs/common';
import { BaseHttpClient } from './base-http.client';
import { getServiceApiPath } from './service-endpoints';

/**
 * 결재 문서 DTO
 */
export interface ApprovalDocumentDto {
  id: number;
  documentType: string;
  documentId: number;
  title: string;
  requesterId: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  urgency: 'LOW' | 'NORMAL' | 'HIGH';
  createdAt: Date;
}

/**
 * 결재선 DTO
 */
export interface ApprovalLineDto {
  approverId: number;
  approverName: string;
  order: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  approvedAt?: Date;
  comment?: string;
}

/**
 * 결재 요청 생성 DTO
 */
export interface CreateApprovalRequestDto {
  documentType: string;
  documentId: number;
  title: string;
  approverIds: number[];
  urgency?: 'LOW' | 'NORMAL' | 'HIGH';
}

/**
 * Approval Service 클라이언트
 * 
 * 전자결재 문서 조회 및 승인/반려를 위한 API 클라이언트
 */
@Injectable()
export class ApprovalServiceClient {
  constructor(private readonly httpClient: BaseHttpClient) {}

  /**
   * 결재 문서 조회
   */
  async getApproval(approvalId: number, tenantId: number): Promise<ApprovalDocumentDto> {
    const url = getServiceApiPath('APPROVAL_SERVICE', `/approvals/${approvalId}`);
    return this.httpClient.get<ApprovalDocumentDto>(url, {
      headers: { 'X-Tenant-ID': tenantId.toString() },
    });
  }

  /**
   * 결재 요청 생성
   */
  async createApprovalRequest(
    dto: CreateApprovalRequestDto,
    tenantId: number
  ): Promise<ApprovalDocumentDto> {
    const url = getServiceApiPath('APPROVAL_SERVICE', '/approvals');
    return this.httpClient.post<ApprovalDocumentDto>(url, dto, {
      headers: { 'X-Tenant-ID': tenantId.toString() },
    });
  }

  /**
   * 결재 승인
   */
  async approveDocument(
    approvalId: number,
    approverId: number,
    comment: string | undefined,
    tenantId: number
  ): Promise<void> {
    const url = getServiceApiPath('APPROVAL_SERVICE', `/approvals/${approvalId}/approve`);
    await this.httpClient.post(url, { approverId, comment }, {
      headers: { 'X-Tenant-ID': tenantId.toString() },
    });
  }

  /**
   * 결재 반려
   */
  async rejectDocument(
    approvalId: number,
    approverId: number,
    reason: string,
    tenantId: number
  ): Promise<void> {
    const url = getServiceApiPath('APPROVAL_SERVICE', `/approvals/${approvalId}/reject`);
    await this.httpClient.post(url, { approverId, reason }, {
      headers: { 'X-Tenant-ID': tenantId.toString() },
    });
  }

  /**
   * 결재선 조회
   */
  async getApprovalLine(approvalId: number, tenantId: number): Promise<ApprovalLineDto[]> {
    const url = getServiceApiPath('APPROVAL_SERVICE', `/approvals/${approvalId}/lines`);
    return this.httpClient.get<ApprovalLineDto[]>(url, {
      headers: { 'X-Tenant-ID': tenantId.toString() },
    });
  }

  /**
   * 내 결재 대기 목록 조회
   */
  async getMyPendingApprovals(
    approverId: number,
    tenantId: number
  ): Promise<ApprovalDocumentDto[]> {
    const url = getServiceApiPath('APPROVAL_SERVICE', '/approvals/pending');
    return this.httpClient.get<ApprovalDocumentDto[]>(url, {
      headers: { 'X-Tenant-ID': tenantId.toString() },
      params: { approverId },
    });
  }
}
