import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@all-erp/shared/infra';
import { CreateEmployeeDto } from './dto/employee.dto';

@Injectable()
export class EmployeeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateEmployeeDto) {
    return this.prisma.employee.create({
      data: {
        userId: dto.userId,
        tenantId: dto.tenantId,
        departmentId: dto.departmentId,
        position: dto.position,
        salary: dto.salary,
        joinDate: new Date(dto.joinDate),
      },
    });
  }

  async findAll(tenantId: string) {
    return this.prisma.employee.findMany({
      where: { tenantId },
      include: { user: true, department: true },
    });
  }

  async findOne(id: string) {
    const employee = await this.prisma.employee.findUnique({
      where: { id },
      include: { user: true, department: true },
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    return employee;
  }
}
