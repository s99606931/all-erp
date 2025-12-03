import { Controller, Post, Get, Body, Query, Param } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Vehicles')
@Controller('vehicles')
export class VehicleController {
  constructor(private readonly service: VehicleService) {}

  @Post()
  async create(@Body() dto: { tenantId: string; licensePlate: string; model: string }) {
    return this.service.create(dto.tenantId, dto.licensePlate, dto.model);
  }

  @Post(':id/reserve')
  async reserve(@Param('id') id: string, @Body() dto: { userId: string; startDate: string; endDate: string; purpose?: string }) {
    return this.service.reserve(id, dto.userId, dto.startDate, dto.endDate, dto.purpose);
  }

  @Get()
  async findAll(@Query('tenantId') tenantId: string) {
    return this.service.findAll(tenantId);
  }
}
