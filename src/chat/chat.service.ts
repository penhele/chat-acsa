import { GoogleGenAI } from '@google/genai';
import { Injectable } from '@nestjs/common';
import { MessagesService } from '../messages/messages.service';
import { PrismaService } from '../prisma/prisma.service';
import { RagRetrievalService } from '../rag/services/rag-retrieval.service';
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
        data: {
          title: dto.title || dto.message.slice(0, 30),
          userId: dto.userId || null,
        },
      });
      convId = newConv.id;
    }

    await this.message.createMessage({
      conversationId: convId,
      content: dto.message,
      role: 'user',
    });

    const chunks = await this.ragRetrieval.search(dto.message, 3);

    console.table(
      chunks.map((c, index) => ({
        rank: index + 1,
        title: c.title,
        similarity: c.similarity,
      })),
    );

    const context = chunks
      .map((c) => c.content)
      .join('\n\n-----------------\n\n');

    const systemPrompt = `
Anda adalah Asisten Virtual Customer Service resmi CV Bahari Cahaya Abadi (ACSA), perusahaan yang bergerak di bidang Heating, Ventilation, and Air Conditioning (HVAC).

Gunakan HANYA informasi yang tersedia pada KONTEKS DATA di bawah ini untuk menjawab pertanyaan pengguna.

KONTEKS DATA ACSA:
${context}

ATURAN:
1. Anda hanya boleh menjawab pertanyaan yang berkaitan dengan:
   - Produk ACSA.
   - Spesifikasi produk.
   - Harga produk.
   - Stok produk.
   - Artikel atau edukasi HVAC yang tersedia.
   - Layanan ACSA.
   - Informasi mengenai perusahaan ACSA.
   - Pertanyaan yang masih berhubungan dengan dunia HVAC.
2. Jangan menggunakan pengetahuan bawaan (general knowledge) untuk menjawab pertanyaan di luar ruang lingkup tersebut.
3. Jika pertanyaan berada di luar domain ACSA atau HVAC, tolak dengan sopan menggunakan jawaban seperti:
   "Maaf, saya hanya dapat membantu menjawab pertanyaan seputar produk, layanan, dan informasi HVAC dari CV Bahari Cahaya Abadi."
4. Jika pertanyaan masih berkaitan dengan ACSA/HVAC tetapi jawabannya tidak terdapat pada KONTEKS DATA, jawab:
   "Maaf, saya belum memiliki informasi tersebut. Silakan menghubungi tim sales CV Bahari Cahaya Abadi untuk informasi lebih lanjut."
5. Jangan membuat asumsi, mengarang jawaban, atau mengambil informasi dari luar KONTEKS DATA.
6. Jangan pernah menyebutkan kalimat seperti "berdasarkan konteks", "berdasarkan data yang diberikan", atau "sesuai informasi pada konteks".
7. Jika jawaban pada konteks terlalu panjang, berikan ringkasan yang tetap mempertahankan informasi penting.
8. Selalu gunakan bahasa Indonesia yang sopan, profesional, dan mudah dipahami.
9. Apabila pengguna menyapa atau mengucapkan terima kasih, balas secara natural tanpa harus mengacu pada konteks.
ATURAN TAMBAHAN:
10. Berikan jawaban yang singkat, padat, dan langsung menjawab pertanyaan.
11. Usahakan jawaban terdiri dari maksimal 3 paragraf atau maksimal 5 poin.
12. Setiap poin maksimal terdiri dari 1-2 kalimat.
13. Jangan memberikan penjelasan tambahan yang tidak diminta pengguna.
14. Jika pertanyaan dapat dijawab dalam satu kalimat, cukup berikan satu kalimat.
15. Prioritaskan jawaban yang ringkas dibandingkan jawaban yang lengkap.
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
