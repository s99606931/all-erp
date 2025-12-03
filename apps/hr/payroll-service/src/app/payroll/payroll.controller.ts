import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { PayrollService } from './payroll.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Payroll')
@Controller('payroll')
export class PayrollController {
  constructor(private readonly service: PayrollService) {}

  @Post('generate')
  @ApiOperation({ summary: 'Generate payroll for an employee' })
  async generate(@Body() dto: { employeeId: string; period: string }) {
    return this.service.generatePayroll(dto.employeeId, dto.period);
  }

  @Get()
  @ApiOperation({ summary: 'Get payroll records' })
  async findAll(@Query('tenantId') tenantId: string) {
    return this.service.findAll(tenantId);
  }
}
