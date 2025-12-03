"""
문서 관리 API - RAG를 위한 문서 업로드 및 임베딩
Mock 구현: 메모리 저장
실제 구현 시: LangChain + Milvus Vector DB 필요
"""

from fastapi import APIRouter, UploadFile, File
from pydantic import BaseModel

router = APIRouter()

class DocumentResponse(BaseModel):
    """문서 업로드 응답 모델"""
    filename: str  # 업로드된 파일명
    status: str  # 처리 상태 (embedded, failed 등)
    chunks_count: int  # 분할된 청크 개수
    message: str  # 처리 결과 메시지

# Mock 문서 저장소 (실제로는 Milvus Vector DB)
# 실제 구현 시 Milvus Collection에 저장
MOCK_DOCUMENTS = []

@router.post("/documents", response_model=DocumentResponse)
async def upload_document(file: UploadFile = File(...)):
    """
    문서 업로드 및 임베딩 처리
    
    실제 구현 시 작업 흐름:
    1. LangChain 문서 로더로 파일 파싱
       - PyPDFLoader: PDF 파일
       - TextLoader: TXT 파일
       - UnstructuredWordDocumentLoader: DOCX 파일
    2. RecursiveCharacterTextSplitter로 텍스트 청킹
       - chunk_size: 500~1000 토큰
       - chunk_overlap: 50~100 토큰
    3. 임베딩 모델로 각 청크를 벡터로 변환
       - sentence-transformers 또는 OpenAI Embeddings
    4. Milvus Vector DB에 저장
       - 유사도 검색을 위한 인덱스 생성
    
    현재는 파일명과 크기만 메모리에 저장 (Mock)
    """
    content = await file.read()
    
    # Mock: 단순히 파일 정보만 저장
    # 실제로는 LangChain으로 파싱 후 임베딩
    MOCK_DOCUMENTS.append({
        "filename": file.filename,
        "size": len(content)
    })
    
    return DocumentResponse(
        filename=file.filename,
        status="embedded",
        chunks_count=10,  # Mock value (실제로는 청킹 결과)
        message=f"Document '{file.filename}' has been successfully embedded into vector DB (mock)"
    )

@router.get("/documents")
async def list_documents():
    """
    업로드된 문서 목록 조회
    실제 구현 시 Milvus Collection의 메타데이터 조회
    """
    return {"documents": MOCK_DOCUMENTS, "total": len(MOCK_DOCUMENTS)}
