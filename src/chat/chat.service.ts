import { Injectable } from '@nestjs/common';
import { GenerateResponseDto } from './dto/generate-response.dto';
import { GoogleGenAI } from '@google/genai';
import { PrismaService } from '../prisma/prisma.service';
import { RagSyncService } from '../rag/rag-sync.service';

@Injectable()
export class ChatService {
  private readonly ai: GoogleGenAI;

  constructor(
    private prisma: PrismaService,
    private ragSyncService: RagSyncService,
  ) {
    this.ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
  }

  async searchRelevantContext(userQuery: string, limit = 3): Promise<string[]> {
    const queryEmbedding =
      await this.ragSyncService.generateEmbedding(userQuery);
    const vectorString = `[${queryEmbedding.join(',')}]`;

    const results: any[] = await this.prisma.$queryRawUnsafe(
      `SELECT "content", "metadata", "embedding" <=> $1::vector AS distance
       FROM "DocumentChunk"
       ORDER BY distance ASC
       LIMIT $2`,
      vectorString,
      limit,
    );

    return results.map((r) => r.content);
  }

  async handleChat(dto: GenerateResponseDto) {
    let convId = dto.conversationId;
    if (!convId) {
      const newConv = await this.prisma.conversation.create({
        data: { title: dto.title, userId: dto.userId },
      });
      convId = newConv.id;
    }

    await this.prisma.message.create({
      data: { conversationId: convId, role: 'user', content: dto.message },
    });

    // const contextChunks = await this.searchRelevantContext(dto.message, 3);
    // const contextText = contextChunks.join('\n---\n');
    // console.log(contextText);

    const systemPrompt = `
        Anda adalah Asisten Virtual Customer Service resmi dari CV. Bahari Cahaya Abadi (ACSA), perusahaan spesialis jual beli & solusi HVAC (Heating, Ventilation, and Air Conditioning).
        Tugas Anda adalah membantu menjawab pertanyaan, keluhan, dan memberikan rekomendasi produk/edukasi secara ramah, profesional, dan akurat.

        Gunakan KONTEKS DATA berikut untuk menjawab pertanyaan pengguna. Jangan memberikan informasi di luar konteks ini jika berkaitan dengan stok, harga, atau spesifikasi produk ACSA:

        KONTEKS DATA ACSA:
       

        Aturan Pertanyaan/Jawaban:
        1. Jika informasi tidak ada di konteks, jawab dengan jujur bahwa Anda belum memiliki data tersebut dan sarankan menghubungi tim sales ACSA.
        2. Jangan menyebutkan kata "berdasarkan konteks data di atas" kepada pengguna.
      `;

    const response = await this.ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: dto.message,
      config: {
        systemInstruction: systemPrompt,
      },
    });

    await this.prisma.message.create({
      data: {
        conversationId: convId,
        content: response.text ?? 'Maaf, saya belum dapat memberikan jawaban.',
        role: 'assistant',
      },
    });

    return {
      conversationId: convId,
      response: response.text,
    };
  }
}
