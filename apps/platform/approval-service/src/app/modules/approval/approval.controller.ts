import { Controller, Post, Get, Patch, Param, Body, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ApprovalService } from './approval.service';
import { CreateApprovalRequestDto } from './dto/create-approval-request.dto';
import { GetApprovalRequestsDto } from './dto/get-approval-requests.dto';
import { ApproveRequestDto } from './dto/approve-request.dto';
import { RejectRequestDto } from './dto/reject-request.dto';

interface PayrollSubmittedEvent {
  data: {
    payrollId: number;
  };
  userId: number;
  tenantId: number;
}

@ApiTags('approval')
@Controller('api/v1/approvals')
export class ApprovalController {
  constructor(private approvalService: ApprovalService) {}

  @Post()
  @ApiOperation({ summary: '결재 요청 생성' })
  async createApprovalRequest(@Body() dto: CreateApprovalRequestDto) {
    return this.approvalService.createRequest(dto);
  }

  @Get()
  @ApiOperation({ summary: '결재 목록 조회' })
  async getApprovalRequests(@Query() query: GetApprovalRequestsDto) {
    return this.approvalService.getRequests(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '결재 상세 조회' })
  async getApprovalRequest(@Param('id', ParseIntPipe) id: number) {
    return this.approvalService.getRequest(id);
  }

  @Patch(':id/approve')
  @ApiOperation({ summary: '결재 승인' })
  async approveRequest(@Param('id', ParseIntPipe) id: number, @Body() dto: ApproveRequestDto) {
    return this.approvalService.approve(id, dto);
  }

  @Patch(':id/reject')
  @ApiOperation({ summary: '결재 반려' })
  async rejectRequest(@Param('id', ParseIntPipe) id: number, @Body() dto: RejectRequestDto) {
    return this.approvalService.reject(id, dto);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: '결재 취소' })
  async cancelRequest(@Param('id', ParseIntPipe) id: number) {
    return this.approvalService.cancel(id);
  }

  @EventPattern('payroll.submitted')
  async handlePayrollSubmitted(@Payload() event: PayrollSubmittedEvent) {
    await this.approvalService.createRequest({
      requestType: 'PAYROLL',
      referenceId: event.data.payrollId,
      referenceType: 'Payroll',
      requesterId: event.userId,
      title: `급여 처리 결재 요청`,
      tenantId: event.tenantId,
    });
  }
}
