import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportResponseDto, ReportStatus } from './dto/report-response.dto';
import { ReportGeneratorService } from './report-generator.service';

/**
 * 보고서 서비스
 * 보고서 생성, 조회, 다운로드 기능을 제공합니다.
 */
@Injectable()
export class ReportService {
  private readonly logger = new Logger(ReportService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly reportGenerator: ReportGeneratorService,
  ) {}

  /**
   * 보고서 생성 요청
   * 비동기로 보고서를 생성합니다.
   * @param createReportDto 보고서 생성 정보
   * @returns 생성된 보고서 정보
   */
  async createReport(createReportDto: CreateReportDto): Promise<ReportResponseDto> {
    this.logger.log(`보고서 생성 요청: ${createReportDto.title}`);

    // 보고서 레코드 생성 (PENDING 상태)
    const report = await this.prisma.report.create({
      data: {
        title: createReportDto.title,
        reportType: createReportDto.reportType,
        format: createReportDto.format,
        status: ReportStatus.PENDING,
        generatedBy: createReportDto.generatedBy,
        tenantId: createReportDto.tenantId,
      },
    });

    // 비동기로 보고서 생성 (백그라운드 작업)
    this.reportGenerator
      .generateReport(report.id, createReportDto)
      .catch((error) => {
        this.logger.error(`보고서 생성 실패 (ID: ${report.id}): ${error.message}`);
      });

    return report as ReportResponseDto;
  }

  /**
   * 보고서 목록 조회
   * 테넌트별, 타입별로 필터링 가능합니다.
   * @param tenantId 테넌트 ID
   * @param reportType 보고서 타입 (선택)
   * @returns 보고서 목록
   */
  async findAll(tenantId: number, reportType?: string): Promise<ReportResponseDto[]> {
    const where: any = { tenantId };
    if (reportType) {
      where.reportType = reportType;
    }

    const reports = await this.prisma.report.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return reports as ReportResponseDto[];
  }

  /**
   * 보고서 상세 조회
   * @param id 보고서 ID
   * @param tenantId 테넌트 ID
   * @returns 보고서 상세 정보
   */
  async findOne(id: number, tenantId: number): Promise<ReportResponseDto> {
    const report = await this.prisma.report.findFirst({
      where: { id, tenantId },
    });

    if (!report) {
      throw new NotFoundException(`보고서를 찾을 수 없습니다. (ID: ${id})`);
    }

    return report as ReportResponseDto;
  }

  /**
   * 보고서 다운로드 URL 조회
   * @param id 보고서 ID
   * @param tenantId 테넌트 ID
   * @returns 다운로드 URL
   */
  async getDownloadUrl(id: number, tenantId: number): Promise<string> {
    const report = await this.findOne(id, tenantId);

    if (report.status !== ReportStatus.COMPLETED) {
      throw new NotFoundException(
        `보고서가 아직 완료되지 않았습니다. (상태: ${report.status})`,
      );
    }

    if (!report.fileUrl) {
      throw new NotFoundException('보고서 파일을 찾을 수 없습니다.');
    }

    return report.fileUrl;
  }
}
