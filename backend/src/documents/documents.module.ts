import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { LlmService } from './llm.service';
import { OcrService } from './ocr.service';

@Module({
  controllers: [DocumentsController],
  providers: [DocumentsService, LlmService, OcrService],
})
export class DocumentsModule {}
