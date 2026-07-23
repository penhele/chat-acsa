import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ProductsModule } from '../products/products.module';
import { RagController } from './rag-sync.controller';
import { RagSyncService } from './rag-sync.service';

@Module({
  imports: [PrismaModule, ProductsModule],
  providers: [RagSyncService],
  controllers: [RagController],
})
export class RagSyncModule {}
