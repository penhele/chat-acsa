import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ProductsModule } from '../products/products.module';
import { RagController } from './rag-sync.controller';
import { RagSyncService } from './services/rag-sync.service';
import { RagChunksService } from './services/rag-chunks.service';
import { ArticlesModule } from '../articles/articles.module';
import { RagEmbeddingService } from './services/rag-embedding.service';

@Module({
  imports: [PrismaModule, ProductsModule, ArticlesModule],
  providers: [RagSyncService, RagChunksService, RagEmbeddingService],
  controllers: [RagController],
  exports: [RagSyncService, RagChunksService, RagEmbeddingService],
})
export class RagSyncModule { }
