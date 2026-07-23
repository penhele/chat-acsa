import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RagSyncService } from './rag-sync.service';

@Injectable()
export class RagRetrievalService {
  constructor(
    private prisma: PrismaService,
    private ragSync: RagSyncService,
  ) {}

  async search(query: string, limit = 5) {
    const embedding = await this.ragSync.generateEmbedding(query);

    const vector = `[${embedding.join(',')}]`;

    return this.prisma.$queryRawUnsafe(
      `
SELECT
content,
metadata,
embedding <=> $1::vector AS distance

FROM "RagChunk"

ORDER BY distance

LIMIT $2
`,
      vector,
      limit,
    );
  }
}
