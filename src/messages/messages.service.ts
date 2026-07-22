import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async createMessage(dto: CreateMessageDto) {
    return this.prisma.message.create({
      data: dto,
    });
  }

  async getHistory(conversationId: string) {
    return this.prisma.message.findMany({
      where: { conversationId },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }
}
