# MinIO (erp-minio)

## 1. 서비스 역할 (Service Role)
**MinIO**는 **S3 호환 객체 스토리지**입니다. AWS S3와 동일한 API를 제공하여 로컬 개발 환경에서 파일 서버 역할을 합니다.
- 이미지, 문서 등 파일 업로드/다운로드 처리
- 정적 리소스 호스팅

## 2. 정상 작동 확인 (Verification)

### 웹 콘솔 (Console)
- 브라우저에서 접속: [http://localhost:9001](http://localhost:9001)
- **계정**: `minioadmin` / `minioadmin`

### 상태 확인
```bash
docker ps | grep erp-minio
```

## 3. 사용 가이드 (Usage Guide)

### 접속 정보
- **API Port**: `9000` (S3 클라이언트/SDK 연결용)
- **Console Port**: `9001` (웹 브라우저용)
- **Access Key**: `minioadmin`
- **Secret Key**: `minioadmin`

### 웹 콘솔 사용법

#### 버킷(Bucket) 생성
1. 왼쪽 메뉴에서 **Buckets** 클릭
2. **Create Bucket** 버튼 클릭
3. 버킷 이름 입력 (예: `profile-images`) 
4. **Create Bucket** 클릭

#### 파일 업로드
1. 생성한 버킷 클릭
2. **Upload** 버튼 클릭
3. 파일 선택 후 업로드

#### 공개 접근 설정
1. 버킷 선택
2. **Manage** → **Access Policy** 클릭
3. **Add Access Rule** 클릭
4. Prefix: `*`, Access: `readonly` 설정

### 애플리케이션에서 사용하기

#### Node.js (AWS SDK v3)
```javascript
const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const fs = require('fs');

// MinIO 클라이언트 설정
const s3Client = new S3Client({
  endpoint: 'http://localhost:9000',
  region: 'us-east-1',
  credentials: {
    accessKeyId: 'minioadmin',
    secretAccessKey: 'minioadmin',
  },
  forcePathStyle: true,  // MinIO에 필수
});

// 파일 업로드
async function uploadFile(bucketName, key, filePath) {
  const fileContent = fs.readFileSync(filePath);
  
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: fileContent,
    ContentType: 'image/jpeg',  // 파일 타입에 맞게 설정
  });
  
  await s3Client.send(command);
  console.log(`Uploaded: ${key}`);
}

// 파일 다운로드
async function downloadFile(bucketName, key, savePath) {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });
  
  const response = await s3Client.send(command);
  const stream = response.Body;
  
  const writeStream = fs.createWriteStream(savePath);
  stream.pipe(writeStream);
}

// 서명된 URL 생성 (임시 접근 링크)
async function getPresignedUrl(bucketName, key, expiresIn = 3600) {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });
  
  const url = await getSignedUrl(s3Client, command, { expiresIn });
  return url;
}

// 사용 예시
await uploadFile('profile-images', 'user-123.jpg', './photo.jpg');
const downloadUrl = await getPresignedUrl('profile-images', 'user-123.jpg');
console.log('Download URL:', downloadUrl);
```

#### Node.js (MinIO SDK)
```javascript
const Minio = require('minio');

const minioClient = new Minio.Client({
  endPoint: 'localhost',
  port: 9000,
  useSSL: false,
  accessKey: 'minioadmin',
  secretKey: 'minioadmin',
});

// 파일 업로드
await minioClient.fPutObject('profile-images', 'user-123.jpg', './photo.jpg', {
  'Content-Type': 'image/jpeg'
});

// 파일 다운로드
await minioClient.fGetObject('profile-images', 'user-123.jpg', './downloaded.jpg');

// 서명된 URL 생성
const url = await minioClient.presignedGetObject('profile-images', 'user-123.jpg', 24 * 60 * 60);
console.log('Download URL:', url);
```

#### Python (boto3)
```python
import boto3
from botocore.client import Config

# MinIO 클라이언트 설정
s3_client = boto3.client(
    's3',
    endpoint_url='http://localhost:9000',
    aws_access_key_id='minioadmin',
    aws_secret_access_key='minioadmin',
    config=Config(signature_version='s3v4'),
    region_name='us-east-1'
)

# 파일 업로드
s3_client.upload_file(
    'photo.jpg',
    'profile-images',
    'user-123.jpg',
    ExtraArgs={'ContentType': 'image/jpeg'}
)

# 파일 다운로드
s3_client.download_file('profile-images', 'user-123.jpg', 'downloaded.jpg')

# 서명된 URL 생성
url = s3_client.generate_presigned_url(
    'get_object',
    Params={'Bucket': 'profile-images', 'Key': 'user-123.jpg'},
    ExpiresIn=3600
)
print(f'Download URL: {url}')
```

### 실전 예제: 프로필 이미지 업로드 API

#### Express.js + Multer
```javascript
const express = require('express');
const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

const s3Client = new S3Client({
  endpoint: 'http://localhost:9000',
  region: 'us-east-1',
  credentials: {
    accessKeyId: 'minioadmin',
    secretAccessKey: 'minioadmin',
  },
  forcePathStyle: true,
});

app.post('/upload/profile', upload.single('image'), async (req, res) => {
  try {
    const userId = req.user.id;
    const fileKey = `profiles/${userId}/${Date.now()}-${req.file.originalname}`;
    
    const command = new PutObjectCommand({
      Bucket: 'profile-images',
      Key: fileKey,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    });
    
    await s3Client.send(command);
    
    const imageUrl = `http://localhost:9000/profile-images/${fileKey}`;
    res.json({ success: true, url: imageUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### MinIO CLI (mc) 사용

#### CLI 설치 및 설정
```bash
# MinIO CLI 설치
docker run --rm -it --network=host minio/mc

# 별칭 설정
mc alias set local http://localhost:9000 minioadmin minioadmin

# 버킷 목록
mc ls local

# 버킷 생성
mc mb local/my-bucket

# 파일 업로드
mc cp myfile.txt local/my-bucket/

# 파일 다운로드
mc cp local/my-bucket/myfile.txt ./
```

### 데이터 관리
- 데이터는 `dev-environment/volumes/minio`에 영구 저장됩니다.

### 문제 해결

#### 업로드가 실패할 때
```bash
# MinIO 로그 확인
docker logs erp-minio --tail 50

# 버킷 권한 확인
# 웹 콘솔에서 Access Policy 확인
```

#### 파일을 찾을 수 없을 때
```bash
# MinIO CLI로 파일 목록 확인
docker run --rm -it --network=host minio/mc ls local/bucket-name/
```
