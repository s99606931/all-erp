import { Test, TestingModule } from '@nestjs/testing';
import { PayrollCalculator } from './payroll.calculator';
import { Prisma } from '@prisma/client';

describe('PayrollCalculator', () => {
  let calculator: PayrollCalculator;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PayrollCalculator],
    }).compile();

    calculator = module.get<PayrollCalculator>(PayrollCalculator);
  });

  it('should be defined', () => {
    expect(calculator).toBeDefined();
  });

  it('should calculate payroll correctly', () => {
    const baseSalary = new Prisma.Decimal(5000);
    const result = calculator.calculate(baseSalary);

    expect(result.total.toNumber()).toBe(4250); // 5000 - 500 (10%) - 250 (5%)
    expect(result.items).toHaveLength(3);
    expect(result.items.find(i => i.type === 'BASE_SALARY')?.amount.toNumber()).toBe(5000);
    expect(result.items.find(i => i.type === 'TAX')?.amount.toNumber()).toBe(-500);
    expect(result.items.find(i => i.type === 'INSURANCE')?.amount.toNumber()).toBe(-250);
  });
});
