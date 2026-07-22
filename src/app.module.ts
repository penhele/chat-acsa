import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { ShortcutsModule } from './shortcuts/shortcuts.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [PrismaModule, ShortcutsModule, ChatModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
