import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { CreateConversationDto } from './dto/create-conversation.dto';

@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Post()
  create(
    @Body() createConversationDto: CreateConversationDto,
    @Body() userId: string,
  ) {
    return this.conversationsService.create(createConversationDto, userId);
  }

  @Get()
  findAll(@Body() userId: string) {
    return this.conversationsService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Body() userId: string) {
    return this.conversationsService.findOne(id, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Body() userId: string) {
    return this.conversationsService.remove(id, userId);
  }
}
