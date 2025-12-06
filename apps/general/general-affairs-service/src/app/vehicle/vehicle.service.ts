import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class VehicleService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, licensePlate: string, model: string) {
    return this.prisma.vehicle.create({
      data: { tenantId, licensePlate, model },
    });
  }

  async reserve(vehicleId: string, userId: string, startDate: string, endDate: string, purpose?: string) {
    // 중복 예약 확인
    const overlapping = await this.prisma.vehicleReservation.findFirst({
      where: {
        vehicleId,
        OR: [
          { AND: [{ startDate: { lte: new Date(startDate) } }, { endDate: { gte: new Date(startDate) } }] },
          { AND: [{ startDate: { lte: new Date(endDate) } }, { endDate: { gte: new Date(endDate) } }] },
        ],
      },
    });

    if (overlapping) {
      throw new ConflictException('Vehicle is already reserved for this period');
    }

    return this.prisma.vehicleReservation.create({
      data: {
        vehicleId,
        userId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        purpose,
      },
    });
  }

  async findAll(tenantId: string) {
    return this.prisma.vehicle.findMany({
      where: { tenantId },
      include: { reservations: true },
    });
  }
}
