import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  UploadedFiles,
  UploadedFile,
  UseGuards,
  Req,
  Query,
  Param,
} from '@nestjs/common';
import { FilesInterceptor, FileInterceptor } from '@nestjs/platform-express';

import { QuizCreateDataType } from './quiz.types';

import { QuizsService } from './quiz.service';

import { JwtAuthGuard } from '../user/jwt/jwt.guard';
import { IncomingMessage } from 'http';

@Controller('quiz')
export class QuizsController {
  constructor(private readonly quizsService: QuizsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async createBook(@UploadedFile() file, @Body() body, @Req() req) {
    // console.log(req);
    return await this.quizsService.createBook(file, body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createQuiz(@Body() data: QuizCreateDataType) {
    return await this.quizsService.createQuiz(data);
  }

  @UseGuards(JwtAuthGuard)
  @Get('book')
  async getBookAll() {
    return await this.quizsService.getBookAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  async getMyQuizAll(@Req() req: IncomingMessage) {
    return await this.quizsService.getMyQuizAll(req);
  }

  @UseGuards(JwtAuthGuard)
  @Get('prob/:id')
  async getQuizProbAll(@Param('id') id, @Req() req: IncomingMessage) {
    return await this.quizsService.getQuizProbAll(id, req);
  }
}
