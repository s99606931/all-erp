import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { CommonCodeService } from './common-code.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Common Codes')
@Controller('common-codes')
export class CommonCodeController {
  constructor(private readonly service: CommonCodeService) {}

  @Post()
  async create(@Body() dto: any) {
    return this.service.create(dto);
  }

  @Get()
  async findAll(@Query('tenantId') tenantId: string) {
    return this.service.findAll(tenantId);
  }
}
