import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class PayrollCalculator {
  calculate(baseSalary: Prisma.Decimal): { total: Prisma.Decimal; items: { type: string; amount: Prisma.Decimal }[] } {
    const tax = baseSalary.mul(0.1); // 10% tax
    const insurance = baseSalary.mul(0.05); // 5% insurance
    const total = baseSalary.sub(tax).sub(insurance);

    return {
      total,
      items: [
        { type: 'BASE_SALARY', amount: baseSalary },
        { type: 'TAX', amount: tax.neg() },
        { type: 'INSURANCE', amount: insurance.neg() },
      ],
    };
  }
}
