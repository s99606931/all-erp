import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { LlmService } from './llm.service';
import { RagService } from './rag.service';
import { VectorStoreService } from './vector-store.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [AiController],
  providers: [LlmService, RagService, VectorStoreService],
  exports: [LlmService, RagService],
})
export class AiModule {}
