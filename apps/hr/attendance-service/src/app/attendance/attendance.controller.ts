import { Controller, Post, Body, Get, Query, Param, Patch } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Attendance')
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly service: AttendanceService) {}

  @Post('check-in')
  @ApiOperation({ summary: 'Check in' })
  async checkIn(@Body() dto: { employeeId: string; tenantId: string }) {
    return this.service.checkIn(dto.employeeId, dto.tenantId);
  }

  @Patch(':id/check-out')
  @ApiOperation({ summary: 'Check out' })
  async checkOut(@Param('id') id: string) {
    return this.service.checkOut(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get attendance records' })
  async findAll(@Query('tenantId') tenantId: string) {
    return this.service.findAll(tenantId);
  }
}
