/*
  Warnings:

  - Made the column `embedding` on table `RagChunk` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "RagChunk" ALTER COLUMN "embedding" SET NOT NULL;
