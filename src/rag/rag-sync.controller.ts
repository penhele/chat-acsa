import { Body, Controller, Post } from '@nestjs/common';
import { RagSyncService } from './rag-sync.service';

@Controller('rag')
export class RagController {
  constructor(private readonly ragSyncService: RagSyncService) {}

  @Post('sync/products')
  async syncProducts() {
    await this.ragSyncService.syncProducts();
    return { message: 'Product sync completed.' };
  }

  @Post('sync/articles')
  async syncArticles() {
    await this.ragSyncService.syncArticles();
    return { message: 'Article sync completed.' };
  }
}
