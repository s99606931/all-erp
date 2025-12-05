import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { EventService } from '@all-erp/shared/infra';
import { ApprovalPrismaService } from '../../prisma/approval-prisma.service';
import { CreateApprovalRequestDto } from './dto/create-approval-request.dto';
import { GetApprovalRequestsDto } from './dto/get-approval-requests.dto';
import { ApproveRequestDto } from './dto/approve-request.dto';
import { RejectRequestDto } from './dto/reject-request.dto';
import { ApprovalRequest, Prisma } from '@prisma/approval-client';

@Injectable()
export class ApprovalService {
  constructor(
    private readonly prisma: ApprovalPrismaService,
    private readonly eventService: EventService,
  ) {}

  async createRequest(dto: CreateApprovalRequestDto): Promise<ApprovalRequest> {
    return this.prisma.$transaction(async (tx) => {
      const request = await tx.approvalRequest.create({
        data: {
          requestType: dto.requestType,
          referenceId: dto.referenceId,
          referenceType: dto.referenceType,
          requesterId: dto.requesterId,
          status: 'PENDING',
          title: dto.title,
          description: dto.description,
          priority: dto.priority || 'NORMAL',
          tenantId: dto.tenantId,
          histories: {
            create: {
              action: 'SUBMITTED',
              actorId: dto.requesterId,
              tenantId: dto.tenantId,
            },
          },
        },
      });
      return request;
    });
  }

  async getRequests(dto: GetApprovalRequestsDto): Promise<ApprovalRequest[]> {
    const where: Prisma.ApprovalRequestWhereInput = {};
    if (dto.requesterId) where.requesterId = dto.requesterId;
    if (dto.status) where.status = dto.status;
    if (dto.tenantId) where.tenantId = dto.tenantId;

    return this.prisma.approvalRequest.findMany({
      where,
      include: {
        approvalLines: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getRequest(id: number): Promise<ApprovalRequest> {
    const request = await this.prisma.approvalRequest.findUnique({
      where: { id },
      include: {
        approvalLines: true,
        histories: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!request) {
      throw new NotFoundException(`Approval request with ID ${id} not found`);
    }

    return request;
  }

  async approve(id: number, dto: ApproveRequestDto): Promise<ApprovalRequest> {
    return this.prisma.$transaction(async (tx) => {
      const request = await tx.approvalRequest.findUnique({
        where: { id },
        include: { approvalLines: true },
      });

      if (!request) throw new NotFoundException(`Request ${id} not found`);

      const line = request.approvalLines.find(l => l.id === dto.approvalLineId);
      if (!line) throw new BadRequestException(`Approval line ${dto.approvalLineId} not found`);
      if (line.status !== 'PENDING') throw new BadRequestException(`Line already processed`);

      await tx.approvalLine.update({
        where: { id: dto.approvalLineId },
        data: {
          status: 'APPROVED',
          comment: dto.comment,
          approvedAt: new Date(),
        },
      });

      await tx.approvalHistory.create({
        data: {
          approvalRequestId: id,
          action: 'APPROVED',
          actorId: line.approverId,
          comment: dto.comment,
          tenantId: request.tenantId,
        },
      });

      const updatedLines = await tx.approvalLine.findMany({ where: { approvalRequestId: id } });
      const allApproved = updatedLines.every(l => l.status === 'APPROVED');

      if (allApproved) {
        await tx.approvalRequest.update({
          where: { id },
          data: { status: 'APPROVED' },
        });

        await this.eventService.emit('approval.completed', {
          approvalRequestId: id,
          referenceType: request.referenceType,
          referenceId: request.referenceId,
          status: 'APPROVED',
          tenantId: request.tenantId
        }, tx);
      }

      const result = await tx.approvalRequest.findUnique({ where: { id } });
      if (!result) throw new NotFoundException(`Request ${id} not found after update`);
      return result;
    });
  }

  async reject(id: number, dto: RejectRequestDto): Promise<ApprovalRequest> {
     return this.prisma.$transaction(async (tx) => {
      const request = await tx.approvalRequest.findUnique({
        where: { id },
        include: { approvalLines: true },
      });

      if (!request) throw new NotFoundException(`Request ${id} not found`);

      const line = request.approvalLines.find(l => l.id === dto.approvalLineId);
      if (!line) throw new BadRequestException(`Approval line ${dto.approvalLineId} not found`);

      await tx.approvalLine.update({
        where: { id: dto.approvalLineId },
        data: {
          status: 'REJECTED',
          comment: dto.comment,
          approvedAt: new Date(),
        },
      });

      await tx.approvalRequest.update({
          where: { id },
          data: { status: 'REJECTED' },
      });

      await tx.approvalHistory.create({
        data: {
          approvalRequestId: id,
          action: 'REJECTED',
          actorId: line.approverId,
          comment: dto.comment,
          tenantId: request.tenantId,
        },
      });

      await this.eventService.emit('approval.rejected', {
          approvalRequestId: id,
          referenceType: request.referenceType,
          referenceId: request.referenceId,
          status: 'REJECTED',
          tenantId: request.tenantId
      }, tx);

      const result = await tx.approvalRequest.findUnique({ where: { id } });
      if (!result) throw new NotFoundException(`Request ${id} not found after update`);
      return result;
    });
  }

  async cancel(id: number): Promise<ApprovalRequest> {
       return this.prisma.$transaction(async (tx) => {
           const request = await tx.approvalRequest.findUnique({
               where: { id },
           });

           if (!request) throw new NotFoundException(`Request ${id} not found`);
           if (request.status !== 'PENDING') throw new BadRequestException(`Cannot cancel processed request`);

           await tx.approvalRequest.update({
               where: { id },
               data: { status: 'CANCELED' },
           });

           await tx.approvalHistory.create({
               data: {
                   approvalRequestId: id,
                   action: 'CANCELED',
                   actorId: request.requesterId,
                   tenantId: request.tenantId,
               },
           });

           const result = await tx.approvalRequest.findUnique({ where: { id } });
           if (!result) throw new NotFoundException(`Request ${id} not found after update`);
           return result;
       });
  }
}
