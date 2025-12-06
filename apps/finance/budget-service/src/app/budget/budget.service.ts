import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateBudgetDto, UpdateSpentDto } from './dto/budget.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class BudgetService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateBudgetDto) {
    return this.prisma.budget.create({
      data: {
        tenantId: dto.tenantId,
        departmentId: dto.departmentId,
        category: dto.category,
        fiscalYear: dto.fiscalYear,
        amount: new Prisma.Decimal(dto.amount),
      },
    });
  }

  async findAll(tenantId: string, fiscalYear?: number) {
    return this.prisma.budget.findMany({
      where: {
        tenantId,
        ...(fiscalYear && { fiscalYear }),
      },
    });
  }

  async updateSpent(id: string, dto: UpdateSpentDto) {
    const budget = await this.prisma.budget.findUnique({ where: { id } });
    if (!budget) {
      throw new ConflictException('Budget not found');
    }

    const newSpent = budget.spent.add(new Prisma.Decimal(dto.amount));
    
    // 예산 초과 검증
    if (newSpent.greaterThan(budget.amount)) {
      throw new BadRequestException('Budget overrun: exceeds allocated amount');
    }

    return this.prisma.budget.update({
      where: { id },
      data: { spent: newSpent },
    });
  }
}
