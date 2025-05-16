import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Req,
  Param,
  Body,
  UnauthorizedException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DocumentsService } from './documents.service';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user?: {
    sub: string;
    email: string;
  };
}

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req: AuthenticatedRequest) {
    if (!req.user) {
      throw new UnauthorizedException('Usuário não autenticado');
    }
    const userId = req.user.sub;
    return this.documentsService.handleUpload(file, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/ask')
  async askQuestion(
    @Param('id') id: string,
    @Body('question') question: string,
    @Req() req: AuthenticatedRequest,
  ) {
    if (!req.user) {
      throw new UnauthorizedException('Usuário não autenticado');
    }
    return this.documentsService.answerQuestion(id, question, req.user.sub);
  }
}
