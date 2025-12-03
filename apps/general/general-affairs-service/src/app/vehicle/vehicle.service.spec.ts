import { Test, TestingModule } from '@nestjs/testing';
import { VehicleService } from './vehicle.service';
import { PrismaService } from '@all-erp/shared/infra';
import { ConflictException } from '@nestjs/common';

describe('VehicleService', () => {
  let service: VehicleService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehicleService,
        {
          provide: PrismaService,
          useValue: {
            vehicle: {
              create: jest.fn(),
              findMany: jest.fn(),
            },
            vehicleReservation: {
              findFirst: jest.fn(),
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<VehicleService>(VehicleService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should reject overlapping reservations', async () => {
    (prisma.vehicleReservation.findFirst as jest.Mock).mockResolvedValue({ id: 'res-1' });

    await expect(service.reserve('veh-1', 'user-1', '2024-01-01', '2024-01-05')).rejects.toThrow(ConflictException);
  });
});
