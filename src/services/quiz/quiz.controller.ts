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
  async createBook(
    @UploadedFile() file,
    @Body() body,
    @Req() req: IncomingMessage,
  ) {
    // console.log(req);
    return await this.quizsService.createBook(file, body, req);
  }

  // 모든 책 불러오기
  @UseGuards(JwtAuthGuard)
  @Get('book')
  async getBookAll(@Req() req: IncomingMessage) {
    return await this.quizsService.getBookAll(req);
  }

  // 책 삭제하기
  @UseGuards(JwtAuthGuard)
  @Delete('book/delete/:id')
  async deleteBook(@Param('id') id) {
    return await this.quizsService.deleteBook(id);
  }

  // 책 검색
  @UseGuards(JwtAuthGuard)
  @Get('book/search/:str')
  async searchBook(@Param('str') str: string) {
    return await this.quizsService.searchBook(str);
  }

  // 모든 퀴즈 불러오기
  @UseGuards(JwtAuthGuard)
  @Get('all')
  async getQuizAll(@Req() req: IncomingMessage) {
    return await this.quizsService.getQuizAll(req);
  }

  // 퀴즈 생성
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createQuiz(
    @Body() data: QuizCreateDataType,
    @Req() req: IncomingMessage,
  ) {
    return await this.quizsService.createQuiz(data, req);
  }

  // 퀴즈 삭제하기
  @UseGuards(JwtAuthGuard)
  @Delete('delete/:id')
  async deleteQuiz(@Param('id') id, @Req() req: IncomingMessage) {
    return await this.quizsService.deleteQuiz(id, req);
  }

  // 내 퀴즈 불러오기
  @UseGuards(JwtAuthGuard)
  @Get('my')
  async getMyQuizAll(@Req() req: IncomingMessage) {
    return await this.quizsService.getMyQuizAll(req);
  }

  // 문제 불러오기
  @UseGuards(JwtAuthGuard)
  @Get('prob/:id/:uqid')
  async getQuizProbAll(
    @Param('id') id,
    @Param('uqid') uqid,
    @Req() req: IncomingMessage,
  ) {
    return await this.quizsService.getQuizProbAll(id, uqid, req);
  }

  // 퀴즈 다시하기
  @UseGuards(JwtAuthGuard)
  @Get('prob/:quizLog_id')
  async getRetry(@Param('quizLog_id') id, @Req() req: IncomingMessage) {
    return await this.quizsService.getRetry(id, req);
  }
}
