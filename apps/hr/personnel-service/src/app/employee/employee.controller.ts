import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/employee.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Employees')
@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new employee' })
  async create(@Body() dto: CreateEmployeeDto) {
    return this.employeeService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all employees' })
  async findAll(@Query('tenantId') tenantId: string) {
    return this.employeeService.findAll(tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an employee by ID' })
  async findOne(@Param('id') id: string) {
    return this.employeeService.findOne(id);
  }
}
