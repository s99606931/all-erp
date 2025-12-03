import { Controller, Get, Query } from '@nestjs/common';
import { ReportService } from './report.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Financial Reports')
@Controller('reports')
export class ReportController {
  constructor(private readonly service: ReportService) {}

  @Get('trial-balance')
  @ApiOperation({ summary: 'Generate trial balance' })
  async trialBalance(
    @Query('tenantId') tenantId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.service.generateTrialBalance(tenantId, startDate, endDate);
  }

  @Get('income-statement')
  @ApiOperation({ summary: 'Generate income statement' })
  async incomeStatement(
    @Query('tenantId') tenantId: string,
    @Query('fiscalYear') fiscalYear: string,
  ) {
    return this.service.generateIncomeStatement(tenantId, parseInt(fiscalYear));
  }
}
