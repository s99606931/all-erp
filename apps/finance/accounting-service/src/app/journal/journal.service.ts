import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateJournalEntryDto } from './dto/journal.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class JournalService {
  constructor(private readonly prisma: PrismaService) {}

  async createEntry(dto: CreateJournalEntryDto) {
    // 복식부기 검증: 차변 합계 = 대변 합계
    const totalDebit = dto.lines.reduce(
      (sum, line) => sum.add(new Prisma.Decimal(line.debit)),
      new Prisma.Decimal(0)
    );
    const totalCredit = dto.lines.reduce(
      (sum, line) => sum.add(new Prisma.Decimal(line.credit)),
      new Prisma.Decimal(0)
    );

    if (!totalDebit.equals(totalCredit)) {
      throw new BadRequestException(
        `Double-entry validation failed: Debit (${totalDebit}) != Credit (${totalCredit})`
      );
    }

    return this.prisma.journalEntry.create({
      data: {
        tenantId: dto.tenantId,
        entryDate: new Date(dto.entryDate),
        description: dto.description,
        lines: {
          create: dto.lines.map((line) => ({
            accountId: line.accountId,
            debit: new Prisma.Decimal(line.debit),
            credit: new Prisma.Decimal(line.credit),
          })),
        },
      },
      include: { lines: true },
    });
  }

  async findAll(tenantId: string) {
    return this.prisma.journalEntry.findMany({
      where: { tenantId },
      include: { lines: { include: { account: true } } },
    });
  }
}
