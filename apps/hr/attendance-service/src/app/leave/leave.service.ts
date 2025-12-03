import { Injectable } from '@nestjs/common';
import { PrismaService } from '@all-erp/shared/infra';

@Injectable()
export class LeaveService {
  constructor(private readonly prisma: PrismaService) {}

  async requestLeave(dto: any) {
    return this.prisma.leaveRequest.create({
      data: {
        ...dto,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
      },
    });
  }

  async findAll(tenantId: string) {
    return this.prisma.leaveRequest.findMany({ where: { tenantId } });
  }
}
