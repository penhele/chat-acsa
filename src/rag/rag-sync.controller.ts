import { Body, Controller, Post } from '@nestjs/common';
import { RagSyncService } from './rag-sync.service';

@Controller('test')
export class RagController {
  constructor(private readonly ragSyncService: RagSyncService) {}

  @Post('embedding')
  async testEmbedding(@Body() body: { text: string }) {
    const embedding = await this.ragSyncService.generateEmbedding(body.text);

    return {
      text: body.text,
      dimension: embedding.length,
      first10: embedding.slice(0, 10),
      last10: embedding.slice(-10),
    };
  }
}
