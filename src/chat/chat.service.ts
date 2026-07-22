import { Injectable } from '@nestjs/common';
import { GenerateResponseDto } from './dto/generate-response.dto';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class ChatService {
  private readonly ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
  }

  async generateResponse(dto: GenerateResponseDto) {
    const interaction = await this.ai.interactions.create({
      model: 'gemini-3.6-flash',
      input: dto.message,
    });

    return {
      response: interaction.output_text,
      usage: interaction.usage,
    };
  }
}
