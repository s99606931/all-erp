"""
RAG 챗봇 API - 사내 규정 질의응답
Mock 구현: 키워드 기반 매칭
실제 구현 시: Milvus Vector DB + vLLM 필요
"""

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class ChatRequest(BaseModel):
    """채팅 요청 모델"""
    question: str  # 사용자 질문
    tenant_id: str = "default"  # 테넌트 ID (멀티테넌시 지원)

class ChatResponse(BaseModel):
    """채팅 응답 모델"""
    answer: str  # AI가 생성한 답변
    confidence: float  # 답변 신뢰도 (0.0 ~ 1.0)
    sources: list[str]  # 답변 근거 문서 목록

# Mock RAG 지식베이스 (실제로는 Vector DB에 저장)
# 실제 구현 시:
# 1. 사내 규정 문서를 청킹(Chunking)
# 2. Embedding 모델로 벡터화
# 3. Milvus에 저장
MOCK_KB = {
    "연차": "연차 휴가는 입사 후 1년 경과 시 15일이 부여됩니다. 3년 이상 근무 시 매 2년마다 1일씩 가산되어 최대 25일까지 부여됩니다.",
    "급여": "급여는 매월 25일에 지급됩니다. 25일이 휴일인 경우 전날 지급됩니다.",
    "출퇴근": "근무 시간은 오전 9시부터 오후 6시까지이며, 점심시간은 12시부터 1시까지입니다.",
}

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    RAG 기반 챗봇 엔드포인트
    
    실제 구현 시 작업 흐름:
    1. 사용자 질문을 Embedding 모델로 벡터화
    2. Milvus에서 유사도 검색으로 관련 문서 조회
    3. 검색된 문서와 질문을 LLM에 전달
    4. LLM이 생성한 답변 반환
    
    현재는 키워드 기반 간단한 매칭으로 구현 (Mock)
    """
    question = request.question.lower()
    
    # 키워드 기반 간단한 매칭 (Mock)
    # 실제로는 Vector Search + LLM 사용
    for keyword, answer in MOCK_KB.items():
        if keyword in question:
            return ChatResponse(
                answer=answer,
                confidence=0.95,  # 높은 신뢰도
                sources=["사내규정.pdf"]  # 답변 근거 문서
            )
    
    # 매칭되는 답변이 없는 경우
    return ChatResponse(
        answer="죄송합니다. 해당 질문에 대한 답변을 찾을 수 없습니다. 인사팀에 문의해 주세요.",
        confidence=0.0,  # 낮은 신뢰도
        sources=[]  # 근거 문서 없음
    )
