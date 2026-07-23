import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RagChunksService {
  constructor(private readonly prisma: PrismaService) {}

  async upsert(data: {
    sourceType: string;
    sourceId: string;
    content: string;
    metadata: any;
    embedding: number[];
  }) {
    const vector = `[${data.embedding.join(',')}]`;

    await this.prisma.$executeRawUnsafe(
      `
INSERT INTO "RagChunk"
(
    id,
    "sourceType",
    "sourceId",
    content,
    metadata,
    embedding,
    "updatedAt"
)
VALUES
(
    gen_random_uuid(),
    $1,
    $2,
    $3,
    $4::jsonb,
    $5::vector,
    NOW()
)
ON CONFLICT ("sourceType","sourceId")
DO UPDATE SET

content = EXCLUDED.content,
metadata = EXCLUDED.metadata,
embedding = EXCLUDED.embedding,
"updatedAt" = NOW();
`,
      data.sourceType,
      data.sourceId,
      data.content,
      JSON.stringify(data.metadata),
      vector,
    );
  }
}
