# AI Service - Mock implementation
# 
# This is a simplified FastAPI implementation with mock AI features.
# For production use, replace with:
# - Vector DB (Milvus/Qdrant)
# - LLM inference (vLLM + Llama 3)
# - OCR (Tesseract/Google Vision API)
# - ML-based anomaly detection

## Installation

```bash
cd apps/ai/ai-service
poetry install
```

## Running

```bash
poetry run uvicorn app.main:app --host 0.0.0.0 --port 3007 --reload
```

## API Documentation

Visit http://localhost:3007/docs for Swagger UI

## Endpoints

- `POST /api/v1/chat` - RAG chatbot (mock)
- `POST /api/v1/documents` - Upload documents (mock embedding)
- `POST /api/v1/accounting/ocr` - OCR receipt (mock)
- `POST /api/v1/accounting/classify` - Classify expense (rule-based)
- `POST /api/v1/anomaly/detect` - Detect anomaly (threshold-based)
- `POST /api/v1/anomaly/budget-forecast` - Budget forecast
