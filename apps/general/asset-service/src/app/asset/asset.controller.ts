import { Controller, Post, Get, Body, Query, Param, Patch } from '@nestjs/common';
import { AssetService } from './asset.service';
import { CreateAssetDto } from './dto/asset.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Assets')
@Controller('assets')
export class AssetController {
  constructor(private readonly service: AssetService) {}

  @Post()
  @ApiOperation({ summary: 'Register an asset' })
  async create(@Body() dto: CreateAssetDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all assets' })
  async findAll(@Query('tenantId') tenantId: string) {
    return this.service.findAll(tenantId);
  }

  @Patch(':id/depreciate')
  @ApiOperation({ summary: 'Depreciate an asset' })
  async depreciate(@Param('id') id: string, @Body() body: { years: number }) {
    return this.service.depreciate(id, body.years);
  }
}
