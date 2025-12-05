import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  ParseBoolPipe,
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
import { ReportTemplateService } from './report-template.service';
import {
  CreateReportTemplateDto,
  UpdateReportTemplateDto,
  ReportTemplateResponseDto,
} from './dto/report-template.dto';

/**
 * 보고서 템플릿 API 컨트롤러
 */
@ApiTags('Report Templates')
@Controller('api/v1/report-templates')
export class ReportTemplateController {
  constructor(private readonly reportTemplateService: ReportTemplateService) {}

  /**
   * 템플릿 생성
   * @param createDto 템플릿 생성 정보
   * @returns 생성된 템플릿
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '보고서 템플릿 생성' })
  @ApiResponse({
    status: 201,
    description: '템플릿 생성 성공',
    type: ReportTemplateResponseDto,
  })
  async create(
    @Body() createDto: CreateReportTemplateDto,
  ): Promise<ReportTemplateResponseDto> {
    return this.reportTemplateService.create(createDto);
  }

  /**
   * 템플릿 목록 조회
   * @param tenantId 테넌트 ID
   * @param reportType 보고서 타입 (선택)
   * @param isActive 활성화 상태 (선택)
   * @returns 템플릿 목록
   */
  @Get()
  @ApiOperation({ summary: '보고서 템플릿 목록 조회' })
  @ApiQuery({ name: 'tenantId', required: true, type: Number })
  @ApiQuery({ name: 'reportType', required: false, type: String })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiResponse({
    status: 200,
    description: '템플릿 목록 조회 성공',
    type: [ReportTemplateResponseDto],
  })
  async findAll(
    @Query('tenantId', ParseIntPipe) tenantId: number,
    @Query('reportType') reportType?: string,
    @Query('isActive', new ParseBoolPipe({ optional: true })) isActive?: boolean,
  ): Promise<ReportTemplateResponseDto[]> {
    return this.reportTemplateService.findAll(tenantId, reportType, isActive);
  }

  /**
   * 템플릿 상세 조회
   * @param id 템플릿 ID
   * @param tenantId 테넌트 ID
   * @returns 템플릿 상세 정보
   */
  @Get(':id')
  @ApiOperation({ summary: '보고서 템플릿 상세 조회' })
  @ApiParam({ name: 'id', type: Number })
  @ApiQuery({ name: 'tenantId', required: true, type: Number })
  @ApiResponse({
    status: 200,
    description: '템플릿 조회 성공',
    type: ReportTemplateResponseDto,
  })
  @ApiResponse({ status: 404, description: '템플릿을 찾을 수 없음' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('tenantId', ParseIntPipe) tenantId: number,
  ): Promise<ReportTemplateResponseDto> {
    return this.reportTemplateService.findOne(id, tenantId);
  }

  /**
   * 템플릿 수정
   * @param id 템플릿 ID
   * @param tenantId 테넌트 ID
   * @param updateDto 수정 정보
   * @returns 수정된 템플릿
   */
  @Patch(':id')
  @ApiOperation({ summary: '보고서 템플릿 수정' })
  @ApiParam({ name: 'id', type: Number })
  @ApiQuery({ name: 'tenantId', required: true, type: Number })
  @ApiResponse({
    status: 200,
    description: '템플릿 수정 성공',
    type: ReportTemplateResponseDto,
  })
  @ApiResponse({ status: 404, description: '템플릿을 찾을 수 없음' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Query('tenantId', ParseIntPipe) tenantId: number,
    @Body() updateDto: UpdateReportTemplateDto,
  ): Promise<ReportTemplateResponseDto> {
    return this.reportTemplateService.update(id, tenantId, updateDto);
  }

  /**
   * 템플릿 삭제
   * @param id 템플릿 ID
   * @param tenantId 테넌트 ID
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '보고서 템플릿 삭제' })
  @ApiParam({ name: 'id', type: Number })
  @ApiQuery({ name: 'tenantId', required: true, type: Number })
  @ApiResponse({ status: 204, description: '템플릿 삭제 성공' })
  @ApiResponse({ status: 404, description: '템플릿을 찾을 수 없음' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Query('tenantId', ParseIntPipe) tenantId: number,
  ): Promise<void> {
    return this.reportTemplateService.remove(id, tenantId);
  }
}
