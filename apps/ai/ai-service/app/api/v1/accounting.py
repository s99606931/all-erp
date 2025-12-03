"""
자동 분개 API - OCR 및 계정과목 추천
Mock 구현: 규칙 기반 분류
실제 구현 시: Tesseract/Google Vision API + LLM 필요
"""

from fastapi import APIRouter, UploadFile, File
from pydantic import BaseModel

router = APIRouter()

class OCRResponse(BaseModel):
    """OCR 응답 모델"""
    text: str  # 추출된 텍스트
    suggested_account: str  # AI가 추천하는 계정과목
    confidence: float  # 추천 신뢰도

class AccountRecommendation(BaseModel):
    """계정과목 추천 모델"""
    account_code: str  # 계정과목 코드
    account_name: str  # 계정과목명
    confidence: float  # 추천 신뢰도

@router.post("/accounting/ocr", response_model=OCRResponse)
async def ocr_receipt(file: UploadFile = File(...)):
    """
    영수증 OCR 및 계정과목 자동 추천
    
    실제 구현 시 작업 흐름:
    1. OCR 엔진으로 이미지에서 텍스트 추출
       - Tesseract (오픈소스, 로컬 처리)
       - Google Vision API (클라우드, 정확도 높음)
    2. 추출된 텍스트를 LLM에 전달
       - 상호명, 금액, 날짜 등 구조화
    3. LLM이 거래 내역 분석 후 계정과목 추천
       - Few-shot learning으로 정확도 향상
    4. 신뢰도와 함께 추천 결과 반환
    
    현재는 파일명 기반 간단한 추론 (Mock)
    """
    # Mock: 파일명에서 키워드 추출
    # 실제로는 Tesseract/Google Vision API 사용
    filename = file.filename.lower()
    
    if "coffee" in filename or "cafe" in filename:
        return OCRResponse(
            text="커피 5,000원 (Mock OCR)",
            suggested_account="복리후생비",
            confidence=0.92
        )
    elif "taxi" in filename or "uber" in filename:
        return OCRResponse(
            text="택시비 15,000원 (Mock OCR)",
            suggested_account="여비교통비",
            confidence=0.88
        )
    else:
        return OCRResponse(
            text="영수증 내용 (Mock OCR)",
            suggested_account="일반관리비",
            confidence=0.70
        )

@router.post("/accounting/classify")
async def classify_expense(description: str):
    """
    거래 내역 설명문 기반 계정과목 추천
    
    실제 구현 시:
    - LLM에 거래 설명문을 전달하여 분류
    - 과거 분류 이력을 학습하여 정확도 향상
    
    현재는 키워드 규칙 기반 (Mock)
    """
    desc_lower = description.lower()
    
    # 규칙 기반 분류 (키워드, 계정과목, 신뢰도)
    # 실제로는 LLM이나 분류 모델 사용
    rules = [
        (["커피", "음료", "식사"], "복리후생비", 0.9),
        (["택시", "버스", "지하철"], "여비교통비", 0.95),
        (["노트북", "모니터", "키보드"], "비품비", 0.85),
        (["전기", "수도", "가스"], "공과금", 0.98),
    ]
    
    for keywords, account, conf in rules:
        if any(kw in desc_lower for kw in keywords):
            return AccountRecommendation(
                account_code="5000",  # Mock 코드
                account_name=account,
                confidence=conf
            )
    
    # 매칭되는 규칙이 없는 경우
    return AccountRecommendation(
        account_code="9999",
        account_name="미분류",
        confidence=0.5
    )
