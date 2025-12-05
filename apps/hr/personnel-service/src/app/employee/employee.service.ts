import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService, EventService } from '@all-erp/shared/infra';
import { CreateEmployeeDto } from './dto/employee.dto';

@Injectable()
export class EmployeeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventService: EventService // Raw Query 기반 EventService 주입
  ) {}

  async create(dto: CreateEmployeeDto) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const prismaAny = this.prisma as any;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return prismaAny.$transaction(async (tx: any) => {
      // 1. 직원 생성 (Prisma 모델 사용)
      // 실제 프로젝트에서는 DTO와 스키마를 일치시켜야 합니다.
      const employee = await tx.employee.create({
        data: {
          userId: dto.userId,
          tenantId: dto.tenantId,
          departmentId: dto.departmentId,
          // 필수 필드에 대한 임시 값 생성
          employeeNumber: `EMP-${Date.now()}`,
          name: 'Unknown',
          positionCode: dto.position || 'STAFF',
          hireDate: dto.joinDate ? new Date(dto.joinDate) : new Date(),
          status: 'ACTIVE',
        },
      });

      // 2. 이벤트 발행 (Outbox - Raw Query)
      // tx 객체를 전달하면 EventService가 내부적으로 SQL INSERT를 수행합니다.
      await this.eventService.emit(
        'employee.created',
        {
          tenantId: employee.tenantId,
          employeeId: employee.id,
          name: employee.name,
          departmentId: employee.departmentId,
          joinedAt: employee.hireDate,
        },
        tx
      );

      return employee;
    });
  }

  async findAll(tenantId: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const prismaAny = this.prisma as any;
    return prismaAny.employee.findMany({
      where: { tenantId },
    });
  }

  async findOne(id: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const prismaAny = this.prisma as any;
    const employee = await prismaAny.employee.findUnique({
      where: { id },
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    return employee;
  }
}
