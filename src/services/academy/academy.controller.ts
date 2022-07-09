import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { IncomingMessage } from 'http';
import { JwtAuthGuard } from '../user/jwt/jwt.guard';
import { AcademyService } from './academy.service';
import { CreateAcademyDto } from './dto/academy.dto';

@Controller('academy')
export class AcademyController {
  constructor(private readonly academyService: AcademyService) {}

  // 학원 생성
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Body() reqData: CreateAcademyDto, @Req() req: IncomingMessage) {
    return await this.academyService.create(reqData, req);
  }

  // 학원 검색
  @Post('search')
  async search(@Body() str: { str: string }) {
    return await this.academyService.search(str);
  }

  // 학원 정보 불러오기
  @Get('info')
  async info(@Req() req: IncomingMessage) {
    return await this.academyService.info(req);
  }

  // 내 학원 학생 모두 불러오기
  @UseGuards(JwtAuthGuard)
  @Get('student/all')
  async getAllStudent(@Req() req: IncomingMessage) {
    return await this.academyService.getAllStudent(req);
  }

  // 내 학원 퀴즈 모두 불러오기
  @UseGuards(JwtAuthGuard)
  @Get('quiz/all')
  async getAllQuiz(@Req() req: IncomingMessage) {
    return await this.academyService.getAllQuiz(req);
  }

  // 내 학원 퀴즈 모두 불러오기
  @UseGuards(JwtAuthGuard)
  @Get('book/all')
  async getAllBook(@Req() req: IncomingMessage) {
    return await this.academyService.getAllBook(req);
  }
}
