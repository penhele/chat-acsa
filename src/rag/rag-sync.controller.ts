import { Body, Controller, Get, Post } from '@nestjs/common';
import { RagSyncService } from './services/rag-sync.service';

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

  @Get('sync/last')
  async getLastSync() {
    return this.ragSyncService.getLastSyncTime();
  }
}
