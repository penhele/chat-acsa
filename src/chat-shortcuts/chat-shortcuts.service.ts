import { Injectable } from '@nestjs/common';
import { CreateChatShortcutDto } from './dto/create-chat-shortcut.dto';
import { UpdateChatShortcutDto } from './dto/update-chat-shortcut.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatShortcutsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateChatShortcutDto) {
    return this.prisma.chatShortcut.create({
      data: dto,
    });
  }

  async findAll() {
    return this.prisma.chatShortcut.findMany({});
  }

  async update(id: string, dto: UpdateChatShortcutDto) {
    return this.prisma.chatShortcut.update({
      data: dto,
      where: { id },
    });
  }

  async remove(id: string) {
    return this.prisma.chatShortcut.delete({
      where: { id },
    });
  }
}
