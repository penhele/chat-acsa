import { Prisma } from '@prisma/client';

export interface RagRetrievalResult {
  title: string | null;
  content: string;
  metadata: Prisma.JsonValue | null;
  similarity: number;
}
