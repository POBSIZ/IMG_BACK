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
import { CreateClassDto } from './dto/class.dto';

@Controller('academy')
export class AcademyController {
  constructor(private readonly academyService: AcademyService) {}

  // 학원 생성
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Body() reqData: CreateAcademyDto, @Req() req: IncomingMessage) {
    return await this.academyService.create(reqData, req);
  }

  // 반 생성
  @UseGuards(JwtAuthGuard)
  @Post('class/create')
  async createClass(
    @Body() reqData: Pick<CreateClassDto, 'name'>,
    @Req() req: IncomingMessage,
  ) {
    return await this.academyService.createClass(reqData, req);
  }

  // 모든 반 불러오기
  @UseGuards(JwtAuthGuard)
  @Get('class/all')
  async getClassAll(@Req() req: IncomingMessage) {
    return await this.academyService.getClassAll(req);
  }

  // 모든 반 불러오기
  @UseGuards(JwtAuthGuard)
  @Delete('class/delete/:id')
  async removeClass(
    @Param('id') class_id: string,
    @Req() req: IncomingMessage,
  ) {
    return await this.academyService.removeClass(class_id, req);
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

  // 내 학원 학생, 반 모두 불러오기
  @UseGuards(JwtAuthGuard)
  @Get('student/info/all')
  async getAllClassStudent(@Req() req: IncomingMessage) {
    return await this.academyService.getAllClassStudent(req);
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
