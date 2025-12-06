
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { LlmService } from './llm.service';
import { RagService } from './rag.service';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';

class ChatRequestDto {
  prompt: string;
  systemPrompt?: string;
}

class IndexRequestDto {
  text: string;
}

class RagRequestDto {
  prompt: string;
}

@ApiTags('AI')
@Controller('ai')
export class AiController {
  constructor(
    private readonly llmService: LlmService,
    private readonly ragService: RagService,
  ) {}

  @Post('chat')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'LLM과 대화하기 (Simple Chat)' })
  @ApiBody({ schema: { example: { prompt: '안녕하세요', systemPrompt: '당신은 도움이 되는 비서입니다.' } } })
  @ApiResponse({ status: 200, description: 'LLM 응답 성공' })
  async chat(@Body() body: ChatRequestDto) {
    const response = await this.llmService.chat(body.prompt, body.systemPrompt);
    return { response };
  }

  @Post('index')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '문서 인덱싱 (Vector Store 저장)' })
  @ApiBody({ schema: { example: { text: 'All-ERP 시스템은 최신 마이크로서비스 아키텍처를 따릅니다.' } } })
  @ApiResponse({ status: 201, description: '인덱싱 성공' })
  async index(@Body() body: IndexRequestDto) {
    const count = await this.ragService.indexDocument(body.text);
    return { message: `${count} chunks indexed` };
  }

  @Post('rag')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'RAG 기반 질의응답' })
  @ApiBody({ schema: { example: { prompt: 'All-ERP의 아키텍처는 무엇인가요?' } } })
  @ApiResponse({ status: 200, description: 'RAG 응답 성공' })
  async rag(@Body() body: RagRequestDto) {
    const response = await this.ragService.ask(body.prompt);
    return { response };
  }
}
