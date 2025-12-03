"""
AI Domain Service - FastAPI 애플리케이션
RAG 챗봇, 자동 분개, 이상 탐지 등 AI 기능을 제공하는 서비스
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import chat, documents, accounting, anomaly

# FastAPI 애플리케이션 생성
app = FastAPI(
    title="AI Domain Service",
    description="AI-powered features: RAG chatbot, OCR, Anomaly detection",
    version="1.0.0",
)

# CORS 설정 (Cross-Origin Resource Sharing)
# 프론트엔드에서 API 호출을 허용하기 위한 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 모든 도메인 허용 (운영 환경에서는 특정 도메인만 허용 권장)
    allow_credentials=True,
    allow_methods=["*"],  # 모든 HTTP 메서드 허용
    allow_headers=["*"],  # 모든 헤더 허용
)

# API 라우터 등록
# 각 도메인별로 분리된 라우터를 메인 앱에 등록
app.include_router(chat.router, prefix="/api/v1", tags=["Chat"])
app.include_router(documents.router, prefix="/api/v1", tags=["Documents"])
app.include_router(accounting.router, prefix="/api/v1", tags=["Accounting"])
app.include_router(anomaly.router, prefix="/api/v1", tags=["Anomaly Detection"])

@app.get("/")
def root():
    """루트 엔드포인트 - 서비스 상태 확인 및 문서 링크 제공"""
    return {"message": "AI Domain Service - FastAPI", "docs": "/docs"}
