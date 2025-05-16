import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';

@Injectable()
export class LlmService {
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async explainText(text: string): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Explique o conteúdo do texto OCR para um leigo.',
        },
        {
          role: 'user',
          content: text,
        },
      ],
    });

    return response.choices[0].message.content || '';
  }

  async askQuestionAboutText(text: string, question: string): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Você é um assistente especializado em analisar documentos extraídos por OCR.',
        },
        {
          role: 'user',
          content: `Texto extraído: """${text}"""\n\nPergunta: ${question}`,
        },
      ],
    });

    return response.choices[0].message.content || '';
  }
}
