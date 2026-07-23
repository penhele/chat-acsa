import { Module } from '@nestjs/common';
import { MessagesService } from '../messages/messages.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ProductsService } from '../products/products.service';
import { RagSyncModule } from '../rag/rag-sync.module';
import { RagSyncService } from '../rag/rag-sync.service';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
  imports: [PrismaModule, RagSyncModule],
  controllers: [ChatController],
  providers: [ChatService, RagSyncService, MessagesService, ProductsService],
})
export class ChatModule {}
