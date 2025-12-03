import { Injectable } from '@nestjs/common';
import { PrismaService } from '@all-erp/shared/infra';

@Injectable()
export class DepartmentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: any) {
    return this.prisma.department.create({ data: dto });
  }

  async findAll(tenantId: string) {
    return this.prisma.department.findMany({ where: { tenantId } });
  }
}
