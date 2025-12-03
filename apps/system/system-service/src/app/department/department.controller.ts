import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Departments')
@Controller('departments')
export class DepartmentController {
  constructor(private readonly service: DepartmentService) {}

  @Post()
  async create(@Body() dto: any) {
    return this.service.create(dto);
  }

  @Get()
  async findAll(@Query('tenantId') tenantId: string) {
    return this.service.findAll(tenantId);
  }
}
