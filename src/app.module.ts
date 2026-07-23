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
import { ProductsService } from './products/products.service';
import { ProductsModule } from './products/products.module';
import { ArticlesService } from './articles/articles.service';
import { ArticlesModule } from './articles/articles.module';

@Module({
  imports: [
    PrismaModule,
    ShortcutsModule,
    ChatModule,
    RagSyncModule,
    ConversationsModule,
    MessagesModule,
    ProductsModule,
    ArticlesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    RagSyncService,
    ProductsService,
    ArticlesService,
  ],
})
export class AppModule {}
