import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { LeaveService } from './leave.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Leave')
@Controller('leaves')
export class LeaveController {
  constructor(private readonly service: LeaveService) {}

  @Post()
  @ApiOperation({ summary: 'Request leave' })
  async requestLeave(@Body() dto: any) {
    return this.service.requestLeave(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get leave requests' })
  async findAll(@Query('tenantId') tenantId: string) {
    return this.service.findAll(tenantId);
  }
}
