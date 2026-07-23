// src/rag/rag-sync.service.ts
import { GoogleGenAI } from '@google/genai';
import { Injectable, Logger } from '@nestjs/common';
import { ArticlesService } from '../articles/articles.service';
import { PrismaService } from '../prisma/prisma.service';
import { ProductsService } from '../products/products.service';
import { RagChunksService } from './rag-chunks.service';

@Injectable()
export class RagSyncService {
  private readonly logger = new Logger(RagSyncService.name);
  private ai: GoogleGenAI;

  constructor(
    private prisma: PrismaService,
    private products: ProductsService,
    private articles: ArticlesService,
    private ragChunks: RagChunksService,
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

      await this.ragChunks.upsert({
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

    const articles = await this.articles.findAll();

    for (const article of articles) {
      const document = `
judul: ${article.name}
kategori: ${article.category}
deskripsi: ${article.description}
      `;

      const embedding = await this.generateEmbedding(document);

      await this.ragChunks.upsert({
        sourceType: 'article',
        sourceId: article.id.toString(),
        content: document,
        metadata: {
          name: article.name,
          category: article.category,
        },
        embedding,
      });
    }
  }
}
