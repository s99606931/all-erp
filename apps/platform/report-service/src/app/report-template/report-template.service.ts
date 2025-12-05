import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  CreateReportTemplateDto,
  UpdateReportTemplateDto,
  ReportTemplateResponseDto,
} from './dto/report-template.dto';

/**
 * 보고서 템플릿 서비스
 * 템플릿 CRUD 기능을 제공합니다.
 */
@Injectable()
export class ReportTemplateService {
  private readonly logger = new Logger(ReportTemplateService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * 템플릿 생성
   * @param createDto 템플릿 생성 정보
   * @returns 생성된 템플릿
   */
  async create(
    createDto: CreateReportTemplateDto,
  ): Promise<ReportTemplateResponseDto> {
    this.logger.log(`템플릿 생성: ${createDto.name}`);

    const template = await this.prisma.reportTemplate.create({
      data: {
        name: createDto.name,
        description: createDto.description,
        reportType: createDto.reportType,
        templateData: createDto.templateData,
        tenantId: createDto.tenantId,
      },
    });

    return template as ReportTemplateResponseDto;
  }

  /**
   * 템플릿 목록 조회
   * @param tenantId 테넌트 ID
   * @param reportType 보고서 타입 (선택)
   * @param isActive 활성화 상태 (선택)
   * @returns 템플릿 목록
   */
  async findAll(
    tenantId: number,
    reportType?: string,
    isActive?: boolean,
  ): Promise<ReportTemplateResponseDto[]> {
    const where: any = { tenantId };
    if (reportType) {
      where.reportType = reportType;
    }
    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const templates = await this.prisma.reportTemplate.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return templates as ReportTemplateResponseDto[];
  }

  /**
   * 템플릿 상세 조회
   * @param id 템플릿 ID
   * @param tenantId 테넌트 ID
   * @returns 템플릿 상세 정보
   */
  async findOne(id: number, tenantId: number): Promise<ReportTemplateResponseDto> {
    const template = await this.prisma.reportTemplate.findFirst({
      where: { id, tenantId },
    });

    if (!template) {
      throw new NotFoundException(`템플릿을 찾을 수 없습니다. (ID: ${id})`);
    }

    return template as ReportTemplateResponseDto;
  }

  /**
   * 템플릿 수정
   * @param id 템플릿 ID
   * @param tenantId 테넌트 ID
   * @param updateDto 수정 정보
   * @returns 수정된 템플릿
   */
  async update(
    id: number,
    tenantId: number,
    updateDto: UpdateReportTemplateDto,
  ): Promise<ReportTemplateResponseDto> {
    // 존재 여부 확인
    await this.findOne(id, tenantId);

    this.logger.log(`템플릿 수정 (ID: ${id})`);

    const template = await this.prisma.reportTemplate.update({
      where: { id },
      data: updateDto,
    });

    return template as ReportTemplateResponseDto;
  }

  /**
   * 템플릿 삭제
   * @param id 템플릿 ID
   * @param tenantId 테넌트 ID
   */
  async remove(id: number, tenantId: number): Promise<void> {
    // 존재 여부 확인
    await this.findOne(id, tenantId);

    this.logger.log(`템플릿 삭제 (ID: ${id})`);

    await this.prisma.reportTemplate.delete({
      where: { id },
    });
  }
}
