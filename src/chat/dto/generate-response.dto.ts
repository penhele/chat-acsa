import { IsOptional, IsString } from 'class-validator';

export class GenerateResponseDto {
  @IsString()
  message!: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  conversationId?: string;
}
