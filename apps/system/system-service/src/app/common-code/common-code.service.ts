import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class CommonCodeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: any) {
    return this.prisma.commonCode.create({ data: dto });
  }

  async findAll(tenantId: string) {
    return this.prisma.commonCode.findMany({ where: { tenantId } });
  }
}
