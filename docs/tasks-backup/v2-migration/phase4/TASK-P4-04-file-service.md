# TASK-P4-04: File Service 개발

## 📋 작업 개요
- **Phase**: Phase 4
- **예상 시간**: 1주
- **우선순위**: High
- **선행 작업**: TASK-P4-03

## 🎯 목표

파일 업로드/다운로드 관리 마이크로서비스를 개발합니다 (Minio 연동).

## 📝 상세 작업 내용

### Prisma 스키마 (file_db)

```prisma
model File {
  id          Int      @id @default(autoincrement())
  fileName    String   @map("file_name")
  fileSize    Int      @map("file_size")
  mimeType    String   @map("mime_type")
  storageKey  String   @unique @map("storage_key")  // Minio key
  uploadedBy  Int      @map("uploaded_by")
  tenantId    Int      @map("tenant_id")
  createdAt   DateTime @default(now()) @map("created_at")

  @@map("files")
}
```

### 핵심 API

- POST /api/v1/files/upload (파일 업로드)
- GET /api/v1/files/:id (파일 정보 조회)
- GET /api/v1/files/:id/download (파일 다운로드)
- DELETE /api/v1/files/:id (파일 삭제)

### Minio 연동

```typescript
import { Injectable } from '@nestjs/common';
import * as Minio from 'minio';

@Injectable()
export class MinioService {
  private client: Minio.Client;

  constructor() {
    this.client = new Minio.Client({
      endPoint: 'localhost',
      port: 9000,
      useSSL: false,
      accessKey: 'minioadmin',
      secretKey: 'minioadmin',
    });
  }

  async uploadFile(fileName: string, stream: any) {
    const bucketName = 'erp-files';
    await this.client.putObject(bucketName, fileName, stream);
    return { bucketName, fileName };
  }
}
```

## ✅ 완료 조건

- [ ] file-service 앱 생성
- [ ] Minio 클라이언트 통합
- [ ] 파일 업로드/다운로드 API
- [ ] 이벤트 발행 (file.uploaded, file.deleted)
- [ ] Swagger 문서화

## 🔧 실행 명령어

```bash
pnpm nx serve file-service  # :3044

# Minio Console
open http://localhost:9001
```
