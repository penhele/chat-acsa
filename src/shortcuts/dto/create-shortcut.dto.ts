import { IsBoolean, IsString } from 'class-validator';

export class CreateChatShortcutDto {
  @IsString()
  title!: string;

  @IsString()
  content!: string;

  @IsBoolean()
  isActive?: boolean;
}
