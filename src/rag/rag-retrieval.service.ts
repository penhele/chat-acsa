import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RagEmbeddingService } from './rag-embedding.service';
import { RagChunk } from './interfaces/rag-chunk.interface';

@Injectable()
export class RagRetrievalService {
  constructor(
    private prisma: PrismaService,
    private embedding: RagEmbeddingService,
  ) {}

  async search(query: string, limit = 5): Promise<RagChunk[]> {
    const embedding = await this.embedding.generateQueryEmbedding(query);

    const vector = `[${embedding.join(',')}]`;

    return this.prisma.$queryRawUnsafe<RagChunk[]>(
      `
SELECT
  content,
  metadata,
  1 - (embedding <=> $1::vector) AS similarity

FROM "RagChunk"

WHERE
  1 - (embedding <=> $1::vector) >= 0.70

ORDER BY similarity DESC

LIMIT $2;
`,
      vector,
      limit,
    );
  }
}
