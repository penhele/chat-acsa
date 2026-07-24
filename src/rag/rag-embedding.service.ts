import { GoogleGenAI } from '@google/genai';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RagEmbeddingService {
  private readonly ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
  }

  async generateDocumentEmbedding(
    title: string,
    content: string,
  ): Promise<number[]> {
    const document = `title: ${title ?? 'none'} | text: ${content}`.trim();

    const response = await this.ai.models.embedContent({
      model: 'gemini-embedding-2',
      contents: document,
    });

    const embedding = response.embeddings?.[0]?.values;

    if (!embedding) {
      throw new Error('Document embedding gagal dibuat.');
    }

    return embedding;
  }

  async generateQueryEmbedding(query: string): Promise<number[]> {
    const formattedQuery = `task: search result | query: ${query}`.trim();

    const response = await this.ai.models.embedContent({
      model: 'gemini-embedding-2',
      contents: formattedQuery,
    });

    const embedding = response.embeddings?.[0]?.values;

    if (!embedding) {
      throw new Error('Query embedding gagal dibuat.');
    }

    return embedding;
  }
}
