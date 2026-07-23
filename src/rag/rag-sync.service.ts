// src/rag/rag-sync.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';
import { GoogleGenAI } from '@google/genai';
import { ProductsService } from '../products/products.service';

@Injectable()
export class RagSyncService {
  private readonly logger = new Logger(RagSyncService.name);
  private ai: GoogleGenAI;

  constructor(
    private prisma: PrismaService,
    private products: ProductsService,
  ) {
    this.ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
  }

  // Helper untuk generate vector embedding dari text
  async generateEmbedding(text: string): Promise<number[]> {
    const response = await this.ai.models.embedContent({
      model: 'gemini-embedding-2',
      contents: text,
    });

    const values = response.embeddings?.[0]?.values;

    if (!values) {
      throw new Error('Embedding tidak ditemukan.');
    }

    return values;
  }

  // 1. Sync Data Produk
  async syncProducts() {
    this.logger.log('Syncing products...');

    const products = await this.products.findAll();

    for (const prod of products) {
      const document = `
nama: ${prod.name}
deskripsi: ${prod.description ?? '-'}
brand: ${prod.brand.name}
kategori: ${prod.category.name}
tipe AC: ${prod.ac_type.name}
pk: ${prod.pk ?? '-'}
model: ${prod.model_code ?? '-'}
freon: ${prod.freon_type ?? '-'}
seri: ${prod.series_name ?? '-'}
harga: ${prod.price}
stok: ${prod.quantity}
      `.trim();

      const embedding = await this.generateEmbedding(document);

      await this.saveChunk({
        sourceType: 'product',
        sourceId: prod.id,
        content: document,
        metadata: {
          brand: prod.brand.name,
          category: prod.category.name,
          acType: prod.ac_type.name,
          price: prod.price,
        },
        embedding,
      });
    }
  }

  // 2. Sync Data Artikel dengan Chunking Strategy
  async syncArticles() {
    this.logger.log('Fetching articles from ACSA API...');
    const response = await axios.get(`${process.env.ACSA_API_URL}/articles`);
    const articles = response.data;

    for (const article of articles) {
      const chunks = this.chunkText(article.content, 500);

      for (let i = 0; i < chunks.length; i++) {
        const chunkContent = `Judul Artikel: ${article.title}. ` + chunks[i];
        const embedding = await this.generateEmbedding(chunkContent);

        await this.saveChunk({
          sourceType: 'article',
          sourceId: `${article.id}_chunk_${i}`,
          content: chunkContent,
          metadata: { title: article.title, category: article.category },
          embedding,
        });
      }
    }
  }

  // Simple Character/Paragraph Chunking
  private chunkText(text: string, chunkSize: number): string[] {
    const paragraphs = text.split('\n\n');
    const chunks: string[] = [];
    let currentChunk = '';

    for (const p of paragraphs) {
      if ((currentChunk + p).length > chunkSize) {
        if (currentChunk) chunks.push(currentChunk.trim());
        currentChunk = p;
      } else {
        currentChunk += ` ${p}`;
      }
    }
    if (currentChunk) chunks.push(currentChunk.trim());
    return chunks;
  }

  // Raw SQL query untuk menyisipkan vector data ke Prisma
  private async saveChunk(data: {
    sourceType: string;
    sourceId: string;
    content: string;
    metadata: any;
    embedding: number[];
  }) {
    const vectorString = `[${data.embedding.join(',')}]`;

    await this.prisma.$executeRawUnsafe(
      `DELETE FROM "DocumentChunk" WHERE "sourceType" = $1 AND "sourceId" = $2`,
      data.sourceType,
      data.sourceId,
    );

    await this.prisma.$executeRawUnsafe(
      `INSERT INTO "DocumentChunk" ("id", "sourceType", "sourceId", "content", "metadata", "embedding", "updatedAt")
       VALUES (gen_random_uuid(), $1, $2, $3, $4::jsonb, $5::vector, NOW())`,
      data.sourceType,
      data.sourceId,
      data.content,
      JSON.stringify(data.metadata),
      vectorString,
    );
  }
}
