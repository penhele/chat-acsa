import { MessageRole } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';

export class GenerateResponseDto {
  @IsString()
  message!: string;

  @IsString()
  title!: string;

  @IsString()
  userId!: string;

  @IsString()
  conversationId!: string;
}
