import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RagSyncService } from './rag-sync.service';
import { RagChunk } from './interfaces/rag-chunk.interface';

@Injectable()
export class RagRetrievalService {
  constructor(
    private prisma: PrismaService,
    private ragSync: RagSyncService,
  ) {}

  async search(query: string, limit = 5): Promise<RagChunk[]> {
    const embedding = await this.ragSync.generateEmbedding(query);

    const vector = `[${embedding.join(',')}]`;

    return this.prisma.$queryRawUnsafe<RagChunk[]>(
      `
SELECT
    "content",
    "metadata",
    1 - ("embedding" <=> $1::vector) AS similarity

FROM "RagChunk"

ORDER BY similarity DESC

LIMIT $2
`,
      vector,
      limit,
    );
  }
}
