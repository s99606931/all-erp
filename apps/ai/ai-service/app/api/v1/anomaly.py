"""
이상 탐지 API - 법인카드 사용 패턴 분석 및 예산 초과 예측
Mock 구현: 임계값 기반
실제 구현 시: Isolation Forest, Autoencoder 등 ML 모델 필요
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

router = APIRouter()

class Transaction(BaseModel):
    """거래 정보 모델"""
    amount: float  # 거래 금액
    category: str  # 거래 카테고리
    timestamp: str  # 거래 시각

class AnomalyResponse(BaseModel):
    """이상 탐지 응답 모델"""
    is_anomaly: bool  # 이상 여부
    reason: str  # 이상 판단 이유
    confidence: float  # 판단 신뢰도

class BudgetAlert(BaseModel):
    """예산 초과 경보 모델"""
    department: str  # 부서명
    budget: float  # 총 예산
    spent: float  # 현재 집행액
    projected_spent: float  # 예상 집행액 (연말 기준)
    alert_message: str  # 경보 메시지

@router.post("/anomaly/detect", response_model=AnomalyResponse)
async def detect_anomaly(transaction: Transaction):
    """
    법인카드 사용 이상 탐지
    
    실제 구현 시:
    1. 과거 거래 데이터로 ML 모델 학습
       - Isolation Forest: 이상치 탐지
       - Autoencoder: 정상 패턴 학습 후 이탈 감지
    2. 사용자별 평균/표준편차 계산
    3. Z-score 또는 IQR 방식으로 이상 판단
    4. 시간대, 장소, 금액 패턴 종합 분석
    
    현재는 간단한 규칙 기반 (Mock)
    """
    # 규칙 기반 이상 탐지
    # 실제로는 Isolation Forest, Autoencoder 사용
    if transaction.amount > 1000000:
        return AnomalyResponse(
            is_anomaly=True,
            reason="금액이 평균보다 월등히 높습니다 (>100만원)",
            confidence=0.95
        )
    
    if "해외" in transaction.category:
        return AnomalyResponse(
            is_anomaly=True,
            reason="평소 발생하지 않는 해외 거래입니다",
            confidence=0.88
        )
    
    return AnomalyResponse(
        is_anomaly=False,
        reason="정상 거래 패턴입니다",
        confidence=0.92
    )

@router.post("/anomaly/budget-forecast")
async def forecast_budget_overrun(
    department: str,
    current_spent: float,
    total_budget: float,
    days_elapsed: int,
    total_days: int = 365
):
    """
    예산 초과 조기 경보
    
    현재 집행 추세를 기반으로 연말 예산 초과 여부 예측
    
    실제 구현 시:
    - Prophet, ARIMA 등 시계열 분석 모델 사용
    - 계절성, 트렌드 반영하여 더 정확한 예측
    - 과거 동일 기간 집행률과 비교
    
    현재는 선형 추정 (Mock)
    """
    # 일평균 집행액 계산
    daily_avg = current_spent / days_elapsed if days_elapsed > 0 else 0
    
    # 연말까지 선형 추정
    # 실제로는 Prophet, ARIMA 등 시계열 모델 사용
    projected = daily_avg * total_days
    
    if projected > total_budget:
        # 예산 초과 예상
        return BudgetAlert(
            department=department,
            budget=total_budget,
            spent=current_spent,
            projected_spent=projected,
            alert_message=f"⚠️ 현재 추세로는 예산 {total_budget:,.0f}원을 {projected - total_budget:,.0f}원 초과할 것으로 예상됩니다."
        )
    
    # 정상 범위
    return BudgetAlert(
        department=department,
        budget=total_budget,
        spent=current_spent,
        projected_spent=projected,
        alert_message="✅ 현재 집행률은 정상 범위입니다."
    )
