import { Controller, Post, Get, Body, Query, Param } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Inventory')
@Controller('inventory')
export class InventoryController {
  constructor(private readonly service: InventoryService) {}

  @Post()
  async create(@Body() dto: { tenantId: string; itemName: string; minQuantity: number }) {
    return this.service.create(dto.tenantId, dto.itemName, dto.minQuantity);
  }

  @Post(':id/transaction')
  async recordTransaction(@Param('id') id: string, @Body() dto: { type: 'IN' | 'OUT'; quantity: number; date: string }) {
    return this.service.recordTransaction(id, dto.type, dto.quantity, dto.date);
  }

  @Get()
  async findAll(@Query('tenantId') tenantId: string) {
    return this.service.findAll(tenantId);
  }
}
