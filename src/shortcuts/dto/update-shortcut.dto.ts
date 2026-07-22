import { PartialType } from '@nestjs/mapped-types';
import { CreateChatShortcutDto } from './create-shortcut.dto';

export class UpdateChatShortcutDto extends PartialType(CreateChatShortcutDto) {}
