import { Controller, Get, Post, Body, Param, Query, Patch } from '@nestjs/common';
import { BudgetService } from './budget.service';
import { CreateBudgetDto, UpdateSpentDto } from './dto/budget.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Budget')
@Controller('budgets')
export class BudgetController {
  constructor(private readonly service: BudgetService) {}

  @Post()
  @ApiOperation({ summary: 'Create a budget' })
  async create(@Body() dto: CreateBudgetDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all budgets' })
  async findAll(
    @Query('tenantId') tenantId: string,
    @Query('fiscalYear') fiscalYear?: string,
  ) {
    return this.service.findAll(tenantId, fiscalYear ? parseInt(fiscalYear) : undefined);
  }

  @Patch(':id/spent')
  @ApiOperation({ summary: 'Update spent amount' })
  async updateSpent(@Param('id') id: string, @Body() dto: UpdateSpentDto) {
    return this.service.updateSpent(id, dto);
  }
}
