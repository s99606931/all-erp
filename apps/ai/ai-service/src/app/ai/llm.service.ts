
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { ChatOpenAI } from '@langchain/openai';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';

@Injectable()
export class LlmService {
  private readonly logger = new Logger(LlmService.name);
  private model: BaseChatModel;

  constructor(private configService: ConfigService) {
    this.initializeModel();
  }

  private initializeModel() {
    const provider = this.configService.get<string>('LLM_PROVIDER', 'google');
    
    if (provider === 'google') {
      const apiKey = this.configService.get<string>('GOOGLE_API_KEY');
      if (!apiKey) {
        this.logger.warn('GOOGLE_API_KEY not found. LLM features may fail.');
      }
      this.model = new ChatGoogleGenerativeAI({
        apiKey,
        model: 'gemini-pro',
        maxOutputTokens: 2048,
      });
    } else {
      const apiKey = this.configService.get<string>('OPENAI_API_KEY');
      if (!apiKey) {
        this.logger.warn('OPENAI_API_KEY not found. LLM features may fail.');
      }
      this.model = new ChatOpenAI({
        apiKey,
        modelName: 'gpt-4o',
        temperature: 0.7,
      });
    }
    
    this.logger.log(`LLM Service initialized with provider: ${provider}`);
  }

  async chat(prompt: string, systemPrompt?: string): Promise<string> {
    try {
      const messages = [];
      if (systemPrompt) {
        messages.push(new SystemMessage(systemPrompt));
      }
      messages.push(new HumanMessage(prompt));

      const response = await this.model.invoke(messages);
      
      // Handle different content types (string or array of content blocks)
      const content = response.content;
      if (typeof content === 'string') {
        return content;
      } else if (Array.isArray(content)) {
        return content.map(c => {
             if (c.type === 'text') return c.text;
             return '';
        }).join('\n');
      }
      return String(content);
      
    } catch (error) {
      this.logger.error('Error during LLM chat', error);
      throw error;
    }
  }
}
