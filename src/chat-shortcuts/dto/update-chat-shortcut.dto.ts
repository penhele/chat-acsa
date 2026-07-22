import { PartialType } from '@nestjs/mapped-types';
import { CreateChatShortcutDto } from './create-chat-shortcut.dto';

export class UpdateChatShortcutDto extends PartialType(CreateChatShortcutDto) {}
