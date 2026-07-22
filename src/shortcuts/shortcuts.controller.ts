import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ShortcutsService } from './shortcuts.service';
import { CreateChatShortcutDto } from './dto/create-shortcut.dto';
import { UpdateChatShortcutDto } from './dto/update-shortcut.dto';

@Controller('chat-shortcuts')
export class ShortcutsController {
  constructor(private readonly chatShortcutsService: ShortcutsService) {}

  @Post()
  create(@Body() createChatShortcutDto: CreateChatShortcutDto) {
    return this.chatShortcutsService.create(createChatShortcutDto);
  }

  @Get()
  findAll() {
    return this.chatShortcutsService.findAll();
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateChatShortcutDto: UpdateChatShortcutDto,
  ) {
    return this.chatShortcutsService.update(id, updateChatShortcutDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatShortcutsService.remove(id);
  }
}
