/*
  Warnings:

  - You are about to alter the column `embedding` on the `RagChunk` table. The data in that column could be lost. The data in that column will be cast from `JsonB` to `Unsupported("vector")`.

*/

-- AlterTable
CREATE EXTENSION IF NOT EXISTS vector;

ALTER TABLE "RagChunk"
DROP COLUMN "embedding";

ALTER TABLE "RagChunk"
ADD COLUMN "embedding" vector(3072);