import { Body, Controller, Post } from '@nestjs/common';
import { ChatService } from './chat.service';
import { GenerateResponseDto } from './dto/generate-response.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  create(@Body() GenerateResponseDto: GenerateResponseDto) {
    return this.chatService.generateResponse(GenerateResponseDto);
  }
}
