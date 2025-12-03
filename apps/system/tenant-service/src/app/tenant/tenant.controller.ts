import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { CreateTenantDto } from './dto/tenant.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Tenants')
@Controller('tenants')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new tenant' })
  async create(@Body() dto: CreateTenantDto) {
    return this.tenantService.createTenant(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tenants' })
  async findAll() {
    return this.tenantService.getAllTenants();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a tenant by ID' })
  async findOne(@Param('id') id: string) {
    return this.tenantService.getTenant(id);
  }
}
