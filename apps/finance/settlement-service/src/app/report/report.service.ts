import { Injectable } from '@nestjs/common';
import { PrismaService } from '@all-erp/shared/infra';
import { Prisma } from '@prisma/client';

@Injectable()
export class ReportService {
  constructor(private readonly prisma: PrismaService) {}

  async generateTrialBalance(tenantId: string, startDate: string, endDate: string) {
    // 계정별 차변/대변 합계 집계
    const entries = await this.prisma.journalEntryLine.findMany({
      where: {
        journalEntry: {
          tenantId,
          entryDate: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        },
      },
      include: { account: true },
    });

    const balances = entries.reduce((acc, line) => {
      const accountCode = line.account.accountCode;
      if (!acc[accountCode]) {
        acc[accountCode] = {
          accountCode,
          accountName: line.account.accountName,
          accountType: line.account.accountType,
          totalDebit: new Prisma.Decimal(0),
          totalCredit: new Prisma.Decimal(0),
        };
      }
      acc[accountCode].totalDebit = acc[accountCode].totalDebit.add(line.debit);
      acc[accountCode].totalCredit = acc[accountCode].totalCredit.add(line.credit);
      return acc;
    }, {} as Record<string, any>);

    return Object.values(balances);
  }

  async generateIncomeStatement(tenantId: string, fiscalYear: number) {
    // 수익/비용 계정 집계
    const revenue = await this.aggregateByType(tenantId, fiscalYear, 'REVENUE');
    const expense = await this.aggregateByType(tenantId, fiscalYear, 'EXPENSE');

    return {
      fiscalYear,
      revenue,
      expense,
      netIncome: revenue.sub(expense),
    };
  }

  private async aggregateByType(tenantId: string, fiscalYear: number, accountType: string) {
    const entries = await this.prisma.journalEntryLine.findMany({
      where: {
        journalEntry: {
          tenantId,
          entryDate: {
            gte: new Date(`${fiscalYear}-01-01`),
            lte: new Date(`${fiscalYear}-12-31`),
          },
        },
        account: { accountType },
      },
    });

    return entries.reduce((sum, line) => {
      // Revenue: credit - debit; Expense: debit - credit
      const amount = accountType === 'REVENUE' ? line.credit.sub(line.debit) : line.debit.sub(line.credit);
      return sum.add(amount);
    }, new Prisma.Decimal(0));
  }
}
