import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateReportDto, ReportFormat } from './dto/create-report.dto';
import { ReportStatus } from './dto/report-response.dto';
import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';
import * as fs from 'fs';
import * as path from 'path';

/**
 * 보고서 생성 서비스
 * PDF, Excel, CSV 형식의 보고서를 생성합니다.
 */
@Injectable()
export class ReportGeneratorService {
  private readonly logger = new Logger(ReportGeneratorService.name);
  private readonly uploadDir = process.env.UPLOAD_DIR || './uploads/reports';

  constructor(private readonly prisma: PrismaService) {
    // 업로드 디렉토리 생성
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  /**
   * 보고서 생성
   * @param reportId 보고서 ID
   * @param createReportDto 보고서 생성 정보
   */
  async generateReport(
    reportId: number,
    createReportDto: CreateReportDto,
  ): Promise<void> {
    try {
      // 상태 업데이트: PROCESSING
      await this.prisma.report.update({
        where: { id: reportId },
        data: { status: ReportStatus.PROCESSING },
      });

      this.logger.log(`보고서 생성 시작 (ID: ${reportId})`);

      // 보고서 데이터 수집 (실제로는 다른 서비스 API 호출)
      const reportData = await this.collectReportData(createReportDto);

      // 포맷에 따라 파일 생성
      let fileUrl: string;
      switch (createReportDto.format) {
        case ReportFormat.PDF:
          fileUrl = await this.generatePDF(reportId, reportData);
          break;
        case ReportFormat.EXCEL:
          fileUrl = await this.generateExcel(reportId, reportData);
          break;
        case ReportFormat.CSV:
          fileUrl = await this.generateCSV(reportId, reportData);
          break;
        default:
          throw new Error(`지원하지 않는 포맷: ${createReportDto.format}`);
      }

      // 상태 업데이트: COMPLETED
      await this.prisma.report.update({
        where: { id: reportId },
        data: {
          status: ReportStatus.COMPLETED,
          fileUrl,
        },
      });

      this.logger.log(`보고서 생성 완료 (ID: ${reportId}, URL: ${fileUrl})`);

      // 이벤트 발행 (report.generated)
      // TODO: RabbitMQ를 통한 이벤트 발행
    } catch (error) {
      this.logger.error(`보고서 생성 실패 (ID: ${reportId}): ${error.message}`);

      // 상태 업데이트: FAILED
      await this.prisma.report.update({
        where: { id: reportId },
        data: {
          status: ReportStatus.FAILED,
          errorMessage: error.message,
        },
      });

      throw error;
    }
  }

  /**
   * 보고서 데이터 수집
   * 실제 환경에서는 다른 마이크로서비스 API를 호출하여 데이터를 수집합니다.
   * @param createReportDto 보고서 생성 정보
   * @returns 보고서 데이터
   */
  private async collectReportData(createReportDto: CreateReportDto): Promise<any> {
    // TODO: 실제 데이터 수집 로직 구현
    // 예: HTTP 클라이언트로 personnel-service, payroll-service 등 호출

    // 임시 목업 데이터
    return {
      title: createReportDto.title,
      reportType: createReportDto.reportType,
      generatedAt: new Date().toISOString(),
      data: [
        { name: '홍길동', department: '개발팀', value: 5000000 },
        { name: '김철수', department: '영업팀', value: 4500000 },
        { name: '이영희', department: 'HR팀', value: 4800000 },
      ],
    };
  }

  /**
   * PDF 보고서 생성
   * @param reportId 보고서 ID
   * @param data 보고서 데이터
   * @returns 파일 URL
   */
  private async generatePDF(reportId: number, data: any): Promise<string> {
    const fileName = `report_${reportId}_${Date.now()}.pdf`;
    const filePath = path.join(this.uploadDir, fileName);

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument();
      const writeStream = fs.createWriteStream(filePath);

      doc.pipe(writeStream);

      // PDF 내용 작성
      doc.fontSize(20).text(data.title, { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text(`생성일시: ${data.generatedAt}`);
      doc.moveDown();
      doc.fontSize(14).text('보고서 데이터:');
      doc.moveDown();

      // 테이블 형식으로 데이터 출력
      data.data.forEach((row: any, index: number) => {
        doc
          .fontSize(10)
          .text(
            `${index + 1}. ${row.name} | ${row.department} | ${row.value.toLocaleString()}원`,
          );
      });

      doc.end();

      writeStream.on('finish', () => {
        resolve(`/uploads/reports/${fileName}`);
      });

      writeStream.on('error', (error) => {
        reject(error);
      });
    });
  }

  /**
   * Excel 보고서 생성
   * @param reportId 보고서 ID
   * @param data 보고서 데이터
   * @returns 파일 URL
   */
  private async generateExcel(reportId: number, data: any): Promise<string> {
    const fileName = `report_${reportId}_${Date.now()}.xlsx`;
    const filePath = path.join(this.uploadDir, fileName);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Report');

    // 헤더 설정
    worksheet.columns = [
      { header: '이름', key: 'name', width: 15 },
      { header: '부서', key: 'department', width: 15 },
      { header: '금액', key: 'value', width: 15 },
    ];

    // 데이터 추가
    data.data.forEach((row: any) => {
      worksheet.addRow(row);
    });

    // 파일 저장
    await workbook.xlsx.writeFile(filePath);

    return `/uploads/reports/${fileName}`;
  }

  /**
   * CSV 보고서 생성
   * @param reportId 보고서 ID
   * @param data 보고서 데이터
   * @returns 파일 URL
   */
  private async generateCSV(reportId: number, data: any): Promise<string> {
    const fileName = `report_${reportId}_${Date.now()}.csv`;
    const filePath = path.join(this.uploadDir, fileName);

    // CSV 헤더
    let csvContent = '이름,부서,금액\n';

    // 데이터 행 추가
    data.data.forEach((row: any) => {
      csvContent += `${row.name},${row.department},${row.value}\n`;
    });

    // 파일 저장
    fs.writeFileSync(filePath, csvContent, 'utf-8');

    return `/uploads/reports/${fileName}`;
  }
}
