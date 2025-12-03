import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@all-erp/shared/infra';
import { PayrollCalculator } from './payroll.calculator';

@Injectable()
export class PayrollService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly calculator: PayrollCalculator,
  ) {}

  async generatePayroll(employeeId: string, period: string) {
    const employee = await this.prisma.employee.findUnique({ where: { id: employeeId } });
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    const { total, items } = this.calculator.calculate(employee.salary);

    return this.prisma.payroll.create({
      data: {
        employeeId,
        tenantId: employee.tenantId,
        period,
        totalAmount: total,
        items: {
          create: items,
        },
      },
      include: { items: true },
    });
  }

  async findAll(tenantId: string) {
    return this.prisma.payroll.findMany({ where: { tenantId } });
  }
}
