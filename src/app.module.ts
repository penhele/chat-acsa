import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { ShortcutsModule } from './shortcuts/shortcuts.module';
import { ChatModule } from './chat/chat.module';
import { RagSyncService } from './rag/rag-sync.service';
import { RagSyncModule } from './rag/rag-sync.module';
import { ConversationsModule } from './conversations/conversations.module';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [
    PrismaModule,
    ShortcutsModule,
    ChatModule,
    RagSyncModule,
    ConversationsModule,
    MessagesModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, RagSyncService],
})
export class AppModule {}
