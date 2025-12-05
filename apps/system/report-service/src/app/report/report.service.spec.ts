import { Test, TestingModule } from '@nestjs/testing';
import { ReportService } from './report.service';
import { ReportGeneratorService } from './report-generator.service';
import { PrismaService } from '@all-erp/shared/infra';
import { CreateReportDto, ReportType, ReportFormat } from './dto/create-report.dto';
import { ReportStatus } from './dto/report-response.dto';
import { NotFoundException } from '@nestjs/common';

describe('ReportService', () => {
  let service: ReportService;
  let prismaService: PrismaService;
  let reportGeneratorService: ReportGeneratorService;

  const mockPrismaService = {
    report: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockReportGeneratorService = {
    generateReport: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: ReportGeneratorService,
          useValue: mockReportGeneratorService,
        },
      ],
    }).compile();

    service = module.get<ReportService>(ReportService);
    prismaService = module.get<PrismaService>(PrismaService);
    reportGeneratorService = module.get<ReportGeneratorService>(
      ReportGeneratorService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('서비스가 정의되어야 함', () => {
    expect(service).toBeDefined();
  });

  describe('createReport', () => {
    it('보고서를 생성해야 함', async () => {
      const createReportDto: CreateReportDto = {
        title: '테스트 보고서',
        reportType: ReportType.PAYROLL,
        format: ReportFormat.PDF,
        generatedBy: 1,
        tenantId: 1,
      };

      const mockReport = {
        id: 1,
        ...createReportDto,
        status: ReportStatus.PENDING,
        fileUrl: null,
        errorMessage: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.report.create.mockResolvedValue(mockReport);
      mockReportGeneratorService.generateReport.mockResolvedValue(undefined);

      const result = await service.createReport(createReportDto);

      expect(result).toEqual(mockReport);
      expect(mockPrismaService.report.create).toHaveBeenCalledWith({
        data: {
          title: createReportDto.title,
          reportType: createReportDto.reportType,
          format: createReportDto.format,
          status: ReportStatus.PENDING,
          generatedBy: createReportDto.generatedBy,
          tenantId: createReportDto.tenantId,
        },
      });
    });
  });

  describe('findAll', () => {
    it('보고서 목록을 조회해야 함', async () => {
      const mockReports = [
        {
          id: 1,
          title: '보고서 1',
          reportType: ReportType.PAYROLL,
          format: ReportFormat.PDF,
          status: ReportStatus.COMPLETED,
          generatedBy: 1,
          fileUrl: '/uploads/report1.pdf',
          errorMessage: null,
          tenantId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.report.findMany.mockResolvedValue(mockReports);

      const result = await service.findAll(1);

      expect(result).toEqual(mockReports);
      expect(mockPrismaService.report.findMany).toHaveBeenCalledWith({
        where: { tenantId: 1 },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('보고서 타입으로 필터링해야 함', async () => {
      mockPrismaService.report.findMany.mockResolvedValue([]);

      await service.findAll(1, ReportType.PAYROLL);

      expect(mockPrismaService.report.findMany).toHaveBeenCalledWith({
        where: { tenantId: 1, reportType: ReportType.PAYROLL },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('findOne', () => {
    it('보고서를 조회해야 함', async () => {
      const mockReport = {
        id: 1,
        title: '보고서 1',
        reportType: ReportType.PAYROLL,
        format: ReportFormat.PDF,
        status: ReportStatus.COMPLETED,
        generatedBy: 1,
        fileUrl: '/uploads/report1.pdf',
        errorMessage: null,
        tenantId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.report.findFirst.mockResolvedValue(mockReport);

      const result = await service.findOne(1, 1);

      expect(result).toEqual(mockReport);
      expect(mockPrismaService.report.findFirst).toHaveBeenCalledWith({
        where: { id: 1, tenantId: 1 },
      });
    });

    it('보고서가 없으면 NotFoundException을 던져야 함', async () => {
      mockPrismaService.report.findFirst.mockResolvedValue(null);

      await expect(service.findOne(999, 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getDownloadUrl', () => {
    it('다운로드 URL을 반환해야 함', async () => {
      const mockReport = {
        id: 1,
        title: '보고서 1',
        reportType: ReportType.PAYROLL,
        format: ReportFormat.PDF,
        status: ReportStatus.COMPLETED,
        generatedBy: 1,
        fileUrl: '/uploads/report1.pdf',
        errorMessage: null,
        tenantId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.report.findFirst.mockResolvedValue(mockReport);

      const result = await service.getDownloadUrl(1, 1);

      expect(result).toBe('/uploads/report1.pdf');
    });

    it('보고서가 완료되지 않았으면 NotFoundException을 던져야 함', async () => {
      const mockReport = {
        id: 1,
        title: '보고서 1',
        reportType: ReportType.PAYROLL,
        format: ReportFormat.PDF,
        status: ReportStatus.PENDING,
        generatedBy: 1,
        fileUrl: null,
        errorMessage: null,
        tenantId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.report.findFirst.mockResolvedValue(mockReport);

      await expect(service.getDownloadUrl(1, 1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
