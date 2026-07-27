import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async createMessage(dto: CreateMessageDto) {
    const conversation = await this.prisma.conversation.findFirst({
      where: {
        id: dto.conversationId,
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found or access denied');
    }

    return this.prisma.message.create({
      data: dto,
    });
  }

  async getHistory(conversationId: string) {
    const conversation = await this.prisma.conversation.findFirst({
      where: {
        id: conversationId,
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found or access denied');
    }

    return this.prisma.message.findMany({
      where: { conversationId },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }
}
