import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Query,
  UploadedFile,
  UseInterceptors,
  ParseIntPipe,
  Res,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes } from '@nestjs/swagger';
import { Response } from 'express';
import { FileService } from './file.service';
import { FileUploadResponseDto } from './dto/file-upload-response.dto';
import { GetFilesQueryDto } from './dto/get-files-query.dto';

/**
 * 파일 관리 API 엔드포인트
 */
@ApiTags('Files')
@Controller('api/v1/files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  /**
   * 파일 업로드
   */
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: '파일 업로드' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '파일 업로드 성공',
    type: FileUploadResponseDto,
  })
  async uploadFile(
    @UploadedFile() file: any, // Multer file object
    @Query('uploadedBy', ParseIntPipe) uploadedBy: number,
    @Query('tenantId', ParseIntPipe) tenantId: number,
  ): Promise<FileUploadResponseDto> {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const uploadedFile = await this.fileService.uploadFile(
      file.originalname,
      file.buffer,
      file.mimetype,
      uploadedBy,
      tenantId
    );

    return {
      id: uploadedFile.id,
      originalName: uploadedFile.originalName,
      fileName: uploadedFile.fileName,
      fileSize: uploadedFile.fileSize,
      mimeType: uploadedFile.mimeType,
      storageKey: uploadedFile.storageKey,
      createdAt: uploadedFile.createdAt,
    };
  }

  /**
   * 파일 목록 조회
   */
  @Get()
  @ApiOperation({ summary: '파일 목록 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '파일 목록 조회 성공',
    type: [FileUploadResponseDto],
  })
  async getFiles(@Query() query: GetFilesQueryDto) {
    return this.fileService.getFiles({
      tenantId: query.tenantId,
      uploadedBy: query.uploadedBy,
    });
  }

  /**
   * 파일 정보 조회
   */
  @Get(':id')
  @ApiOperation({ summary: '파일 정보 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '파일 정보 조회 성공',
    type: FileUploadResponseDto,
  })
  async getFile(@Param('id', ParseIntPipe) id: number) {
    return this.fileService.getFile(id);
  }

  /**
   * 파일 다운로드
   */
  @Get(':id/download')
  @ApiOperation({ summary: '파일 다운로드' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '파일 다운로드 성공',
  })
  async downloadFile(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const { stream, file } = await this.fileService.downloadFile(id);

    res.setHeader('Content-Type', file.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(file.originalName)}"`);
    res.setHeader('Content-Length', file.fileSize);

    stream.pipe(res);
  }

  /**
   * 임시 다운로드 URL 생성 (Presigned URL)
   */
  @Get(':id/download-url')
  @ApiOperation({ summary: '임시 다운로드 URL 생성' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Presigned URL 생성 성공',
    schema: {
      properties: {
        url: { type: 'string', description: '임시 다운로드 URL' },
        expiresIn: { type: 'number', description: '만료 시간 (초)' },
      },
    },
  })
  async getDownloadUrl(
    @Param('id', ParseIntPipe) id: number,
    @Query('expirySeconds') expirySeconds?: number,
  ) {
    const expiry = expirySeconds ? parseInt(expirySeconds.toString(), 10) : 3600;
    const url = await this.fileService.getDownloadUrl(id, expiry);

    return {
      url,
      expiresIn: expiry,
    };
  }

  /**
   * 파일 삭제
   */
  @Delete(':id')
  @ApiOperation({ summary: '파일 삭제' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: '파일 삭제 성공',
  })
  async deleteFile(@Param('id', ParseIntPipe) id: number) {
    await this.fileService.deleteFile(id);
    return { message: 'File deleted successfully' };
  }
}
