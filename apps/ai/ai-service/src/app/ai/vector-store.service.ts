
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Milvus } from '@langchain/community/vectorstores/milvus';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { OpenAIEmbeddings } from '@langchain/openai';
import { Document } from '@langchain/core/documents';
import { Embeddings } from '@langchain/core/embeddings';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';

@Injectable()
export class VectorStoreService implements OnModuleInit {
  private readonly logger = new Logger(VectorStoreService.name);
  private vectorStore: Milvus;
  private embeddings: Embeddings;

  constructor(private configService: ConfigService) {
    this.initializeEmbeddings();
  }

  async onModuleInit() {
    await this.initializeStore();
  }

  private initializeEmbeddings() {
    const provider = this.configService.get<string>('LLM_PROVIDER', 'google');
    
    if (provider === 'google') {
      const apiKey = this.configService.get<string>('GOOGLE_API_KEY');
      this.embeddings = new GoogleGenerativeAIEmbeddings({
        apiKey,
        model: 'text-embedding-004', // Google's efficient embedding model
      });
    } else {
      const apiKey = this.configService.get<string>('OPENAI_API_KEY');
      this.embeddings = new OpenAIEmbeddings({
        apiKey,
        modelName: 'text-embedding-3-small',
      });
    }
  }

  private async initializeStore() {
    const milvusUrl = this.configService.get<string>('MILVUS_URL', 'localhost:19530');
    // NOTE: Milvus collection creation usually happens on first add or manually.
    // LangChain's Milvus wrapper handles simple connection.
    
    // We create an instance but don't connect deeply until we perform operations
    this.vectorStore = new Milvus(this.embeddings, {
      collectionName: 'all_erp_rag',
      url: milvusUrl,
    });
    
    this.logger.log(`Vector Store initialized for Milvus at ${milvusUrl}`);
  }

  async addDocument(text: string, metadata: Record<string, any> = {}) {
    try {
      // Split text into chunks
      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
      });
      
      const docs = await splitter.createDocuments([text], [metadata]);
      
      await this.vectorStore.addDocuments(docs);
      this.logger.log(`Added ${docs.length} chunks to Vector DB`);
      return docs.length;
    } catch (error) {
      this.logger.error('Error adding document to Vector DB', error);
      throw error;
    }
  }

  async search(query: string, k = 4): Promise<Document[]> {
    try {
      const results = await this.vectorStore.similaritySearch(query, k);
      return results;
    } catch (error) {
      this.logger.error('Error searching Vector DB', error);
      // Fallback for demo if DB is not ready
      return [];
    }
  }
}
