import { Module } from '@nestjs/common';
import { ChatShortcutsService } from './chat-shortcuts.service';
import { ChatShortcutsController } from './chat-shortcuts.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ChatShortcutsController],
  providers: [ChatShortcutsService],
})
export class ChatShortcutsModule {}
