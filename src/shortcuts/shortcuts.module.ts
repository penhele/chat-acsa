import { Module } from '@nestjs/common';
import { ShortcutsService } from './shortcuts.service';
import { ShortcutsController } from './shortcuts.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ShortcutsController],
  providers: [ShortcutsService],
})
export class ShortcutsModule {}
