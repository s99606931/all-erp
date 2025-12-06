import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class AttendanceService {
  constructor(private readonly prisma: PrismaService) {}

  async checkIn(employeeId: string, tenantId: string) {
    return this.prisma.attendance.create({
      data: {
        employeeId,
        tenantId,
        date: new Date(),
        checkIn: new Date(),
        status: 'PRESENT',
      },
    });
  }

  async checkOut(id: string) {
    return this.prisma.attendance.update({
      where: { id },
      data: { checkOut: new Date() },
    });
  }

  async findAll(tenantId: string) {
    return this.prisma.attendance.findMany({ where: { tenantId } });
  }
}
