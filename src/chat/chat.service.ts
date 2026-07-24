import { GoogleGenAI } from '@google/genai';
import { Injectable } from '@nestjs/common';
import { MessagesService } from '../messages/messages.service';
import { PrismaService } from '../prisma/prisma.service';
import { RagRetrievalService } from '../rag/rag-retrieval.service';
import { GenerateResponseDto } from './dto/generate-response.dto';

@Injectable()
export class ChatService {
  private readonly ai: GoogleGenAI;

  constructor(
    private prisma: PrismaService,
    private message: MessagesService,
    private ragRetrieval: RagRetrievalService,
  ) {
    this.ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
  }

  async handleChat(dto: GenerateResponseDto) {
    let convId = dto.conversationId;
    if (!convId) {
      const newConv = await this.prisma.conversation.create({
        data: { title: dto.title, userId: dto.userId },
      });
      convId = newConv.id;
    }

    await this.message.createMessage({
      conversationId: convId,
      content: dto.message,
      role: 'user',
    });

    const chunks = await this.ragRetrieval.search(dto.message, 3);

    const context = chunks
      .map((c) => c.content)
      .join('\n\n-----------------\n\n');

    const systemPrompt = `
        Anda adalah Asisten Virtual Customer Service resmi dari CV. Bahari Cahaya Abadi (ACSA), perusahaan spesialis jual beli & solusi HVAC (Heating, Ventilation, and Air Conditioning).
        Tugas Anda adalah membantu menjawab pertanyaan, keluhan, dan memberikan rekomendasi produk/edukasi secara ramah, profesional, dan akurat.

        Gunakan KONTEKS DATA berikut untuk menjawab pertanyaan pengguna. Jangan memberikan informasi di luar konteks ini jika berkaitan dengan stok, harga, atau spesifikasi produk ACSA:

        KONTEKS DATA ACSA:
       ${context}

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

    await this.message.createMessage({
      conversationId: convId,
      content: response.text ?? 'Maaf, saya belum dapat memberikan jawaban.',
      role: 'assistant',
    });

    return {
      conversationId: convId,
      response: response.text,
    };
  }
}
