import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportResponseDto } from './dto/report-response.dto';

/**
 * 보고서 API 컨트롤러
 */
@ApiTags('Reports')
@Controller('api/v1/reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  /**
   * 보고서 생성 요청
   * @param createReportDto 보고서 생성 정보
   * @returns 생성된 보고서 정보
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '보고서 생성 요청' })
  @ApiResponse({
    status: 201,
    description: '보고서 생성 요청 성공',
    type: ReportResponseDto,
  })
  async create(@Body() createReportDto: CreateReportDto): Promise<ReportResponseDto> {
    return this.reportService.createReport(createReportDto);
  }

  /**
   * 보고서 목록 조회
   * @param tenantId 테넌트 ID
   * @param reportType 보고서 타입 (선택)
   * @returns 보고서 목록
   */
  @Get()
  @ApiOperation({ summary: '보고서 목록 조회' })
  @ApiQuery({ name: 'tenantId', required: true, type: Number })
  @ApiQuery({ name: 'reportType', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: '보고서 목록 조회 성공',
    type: [ReportResponseDto],
  })
  async findAll(
    @Query('tenantId', ParseIntPipe) tenantId: number,
    @Query('reportType') reportType?: string,
  ): Promise<ReportResponseDto[]> {
    return this.reportService.findAll(tenantId, reportType);
  }

  /**
   * 보고서 상세 조회
   * @param id 보고서 ID
   * @param tenantId 테넌트 ID
   * @returns 보고서 상세 정보
   */
  @Get(':id')
  @ApiOperation({ summary: '보고서 상세 조회' })
  @ApiParam({ name: 'id', type: Number })
  @ApiQuery({ name: 'tenantId', required: true, type: Number })
  @ApiResponse({
    status: 200,
    description: '보고서 조회 성공',
    type: ReportResponseDto,
  })
  @ApiResponse({ status: 404, description: '보고서를 찾을 수 없음' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('tenantId', ParseIntPipe) tenantId: number,
  ): Promise<ReportResponseDto> {
    return this.reportService.findOne(id, tenantId);
  }

  /**
   * 보고서 다운로드
   * @param id 보고서 ID
   * @param tenantId 테넌트 ID
   * @returns 다운로드 URL
   */
  @Get(':id/download')
  @ApiOperation({ summary: '보고서 다운로드 URL 조회' })
  @ApiParam({ name: 'id', type: Number })
  @ApiQuery({ name: 'tenantId', required: true, type: Number })
  @ApiResponse({
    status: 200,
    description: '다운로드 URL 조회 성공',
    schema: { type: 'object', properties: { url: { type: 'string' } } },
  })
  @ApiResponse({ status: 404, description: '보고서를 찾을 수 없거나 완료되지 않음' })
  async getDownloadUrl(
    @Param('id', ParseIntPipe) id: number,
    @Query('tenantId', ParseIntPipe) tenantId: number,
  ): Promise<{ url: string }> {
    const url = await this.reportService.getDownloadUrl(id, tenantId);
    return { url };
  }
}
