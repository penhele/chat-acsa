import { Module } from '@nestjs/common';
import { MessagesService } from '../messages/messages.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ProductsService } from '../products/products.service';
import { RagRetrievalService } from '../rag/rag-retrieval.service';
import { RagSyncModule } from '../rag/rag-sync.module';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
  imports: [PrismaModule, RagSyncModule],
  controllers: [ChatController],
  providers: [
    ChatService,
    MessagesService,
    ProductsService,
    RagRetrievalService,
  ],
})
export class ChatModule {}
