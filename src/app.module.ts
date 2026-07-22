import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { ChatShortcutsModule } from './chat-shortcuts/chat-shortcuts.module';

@Module({
  imports: [PrismaModule, ChatShortcutsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
