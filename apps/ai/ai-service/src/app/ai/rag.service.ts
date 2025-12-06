
import { Injectable, Logger } from '@nestjs/common';
import { LlmService } from './llm.service';
import { VectorStoreService } from './vector-store.service';

@Injectable()
export class RagService {
  private readonly logger = new Logger(RagService.name);

  constructor(
    private readonly llmService: LlmService,
    private readonly vectorStoreService: VectorStoreService,
  ) {}

  async indexDocument(text: string) {
    return this.vectorStoreService.addDocument(text);
  }

  async search(query: string) {
    return this.vectorStoreService.search(query);
  }

  async ask(prompt: string): Promise<string> {
    // 1. Retrieve relevant context
    const docs = await this.vectorStoreService.search(prompt);
    
    // 2. Format context
    const context = docs.map(doc => doc.pageContent).join('\n\n');
    
    // 3. Construct System Prompt
    const systemPrompt = `
    You are an intelligent assistant for the All-ERP system.
    Use the following pieces of retrieved context to answer the user's question.
    If the context doesn't contain the answer, say "I don't have enough information to answer that based on the provided documents."
    Do not make up answers.
    
    Context:
    ${context}
    `;

    // 4. Generate Answer
    this.logger.debug(`RAG Query with ${docs.length} context documents`);
    return this.llmService.chat(prompt, systemPrompt);
  }
}
