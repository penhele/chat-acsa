import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { RagSyncModule } from '../rag/rag-sync.module';
import { RagSyncService } from '../rag/rag-sync.service';

@Module({
  imports: [PrismaModule, RagSyncModule],
  controllers: [ChatController],
  providers: [ChatService, RagSyncService],
})
export class ChatModule {}
