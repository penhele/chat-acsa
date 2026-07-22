import { MessageRole } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  conversationId!: string;

  @IsEnum(MessageRole)
  role!: MessageRole;

  @IsString()
  content!: string;
}
