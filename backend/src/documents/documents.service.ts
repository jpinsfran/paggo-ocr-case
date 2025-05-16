import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { OcrService } from './ocr.service';
import { LlmService } from './llm.service';

const prisma = new PrismaClient();

@Injectable()
export class DocumentsService {
  constructor(
    private readonly ocrService: OcrService,
    private readonly llmService: LlmService,
  ) {}

  async handleUpload(file: Express.Multer.File, userId: string) {
    if (!file || !file.buffer) {
      throw new BadRequestException('Arquivo inválido.');
    }

    const uploadDir = path.join(__dirname, '..', '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    const filePath = path.join(uploadDir, file.originalname);
    await fs.promises.writeFile(filePath, file.buffer);

    try {
      const text = await this.ocrService.extractText(filePath);
      const llmOutput = await this.llmService.explainText(text);

      const document = await prisma.document.create({
        data: {
          filename: file.originalname,
          imageUrl: filePath,
          text,
          llmOutput,
          userId,
        },
      });

      return document;
    } catch (error) {
      console.error('Erro ao processar documento:', error);
      throw new BadRequestException('Erro ao processar documento');
    }
  }

  async answerQuestion(documentId: string, question: string, userId: string) {
    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        userId,
      },
    });

    if (!document || !document.text) {
      throw new NotFoundException('Documento não encontrado ou sem texto');
    }

    const response = await this.llmService.askQuestionAboutText(document.text, question);
    return { answer: response };
  }
}
