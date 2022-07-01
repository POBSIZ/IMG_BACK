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
  Delete,
} from '@nestjs/common';
import { FilesInterceptor, FileInterceptor } from '@nestjs/platform-express';

import { QuizCreateDataType } from './quiz.types';

import { QuizsService } from './quiz.service';

import { JwtAuthGuard } from '../user/jwt/jwt.guard';
import { IncomingMessage } from 'http';

@Controller('quiz')
export class QuizsController {
  constructor(private readonly quizsService: QuizsService) {}

  // 책 업로드
  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async createBook(@UploadedFile() file, @Body() body, @Req() req) {
    // console.log(req);
    return await this.quizsService.createBook(file, body);
  }

  // 모든 책 불러오기
  @UseGuards(JwtAuthGuard)
  @Get('book')
  async getBookAll() {
    return await this.quizsService.getBookAll();
  }

  // 책 삭제하기
  @UseGuards(JwtAuthGuard)
  @Delete('book/delete/:id')
  async deleteBook(@Param('id') id) {
    return await this.quizsService.deleteBook(id);
  }

  // 퀴즈 생성
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createQuiz(@Body() data: QuizCreateDataType) {
    return await this.quizsService.createQuiz(data);
  }

  // 퀴즈 로그 불러오기
  @UseGuards(JwtAuthGuard)
  @Get('my')
  async getMyQuizAll(@Req() req: IncomingMessage) {
    return await this.quizsService.getMyQuizAll(req);
  }

  // 문제 불러오기
  @UseGuards(JwtAuthGuard)
  @Get('prob/:id')
  async getQuizProbAll(@Param('id') id, @Req() req: IncomingMessage) {
    return await this.quizsService.getQuizProbAll(id, req);
  }
}
