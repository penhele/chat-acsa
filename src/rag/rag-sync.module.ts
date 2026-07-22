import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { RagSyncService } from './rag-sync.service';

@Module({
  imports: [PrismaModule],
  providers: [RagSyncService],
})
export class RagSyncModule {}
