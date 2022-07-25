import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Res,
  UseGuards,
  Header,
} from '@nestjs/common';

import { UsersService } from './user.service';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from './jwt/jwt.guard';
import { IncomingMessage } from 'http';
import { UpdateUserQuizDto, CreateUserQuizDto } from './dto/userQuiz.dto';
import { UserQuizUpadteData } from './user.types';
import { Response } from 'express';

@Controller('auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 회원가입
  @Post('register')
  async register(@Body() reqData: CreateUserDto) {
    return await this.usersService.register(reqData);
  }

  // 로그인
  @Post('login')
  async login(@Body() reqData: LoginUserDto) {
    return await this.usersService.login(reqData);
  }

  // 토큰 유효성 검사
  @UseGuards(JwtAuthGuard)
  @Get('validate')
  async validate(@Req() req: IncomingMessage) {
    return await this.usersService.validate(req);
  }

  // 토큰 유효성 검사
  @UseGuards(JwtAuthGuard)
  @Patch('user/set/class')
  async setStudentClass(
    @Body() data: { class_id: string; user_id: string[] },
    @Req() req: IncomingMessage,
  ) {
    return await this.usersService.setStudentClass(data, req);
  }

  // 유저퀴즈 생성
  @UseGuards(JwtAuthGuard)
  @Post('userQuiz/create')
  async createUserQuiz(
    @Body() data: { users: number[]; quiz_id: number },
    @Req() req: IncomingMessage,
  ) {
    return await this.usersService.createUserQuiz(data, req);
  }

  // 유저퀴즈 업데이트
  @UseGuards(JwtAuthGuard)
  @Patch('userQuiz/update')
  async updateUserQuiz(
    @Body() data: UserQuizUpadteData,
    @Req() req: IncomingMessage,
  ) {
    return await this.usersService.updateUserQuiz(data, req);
  }

  // 회원정보 모두 불러오기
  @UseGuards(JwtAuthGuard)
  @Get('user/student/all')
  async getAllStudentUser(@Req() req: IncomingMessage) {
    return await this.usersService.getAllStudentUser(req);
  }

  // 회원정보 모두 불러오기
  @UseGuards(JwtAuthGuard)
  @Get('user/all')
  async getAllUser(@Req() req: IncomingMessage) {
    return await this.usersService.getAllUser(req);
  }

  // 단일 회원 정보 불러오기
  @UseGuards(JwtAuthGuard)
  @Get('user/:id')
  async getUserInfo(@Param() param, @Req() req: IncomingMessage) {
    return await this.usersService.getUserInfo(param, req);
  }

  // 퀴즈 로그 불러오기
  @UseGuards(JwtAuthGuard)
  @Get('quiz/log')
  async getQuizLog(@Req() req: IncomingMessage) {
    return await this.usersService.getQuizLog(req);
  }

  // 연결 계정 퀴즈 로그 불러오기
  @UseGuards(JwtAuthGuard)
  @Get('quiz/log/chain/:id')
  async getChainQuizLog(@Param('id') id: string, @Req() req: IncomingMessage) {
    return await this.usersService.getChainQuizLog(id, req);
  }

  // 퀴즈 오답 불러오기
  @UseGuards(JwtAuthGuard)
  @Get('quiz/wrongList/:id')
  /**
   *
   * @param {string} param quizLog_id
   * @param {IncomingMessage} req
   */
  async getWrongList(@Param('id') id: string, @Req() req: IncomingMessage) {
    return await this.usersService.getWrongList(id, req);
  }

  // 퀴즈 오답 불러오기
  // @UseGuards(JwtAuthGuard)
  @Get('quiz/wrongList/excel/:id')
  @Header(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  )
  @Header('Content-Disposition', 'attachment; filename=users.xlsx')
  /**
   *
   * @param {string} param quizLog_id
   * @param {IncomingMessage} req
   */
  async getWrongListExcel(
    @Param('id') id: string,
    @Req() req: IncomingMessage,
    @Res() res: Response,
  ) {
    return await this.usersService.getWrongListExcel(id, req, res);
  }

  // 연결 ID 요청
  @UseGuards(JwtAuthGuard)
  @Patch('chain/request')
  async requestChain(
    @Body() data: { target: string },
    @Req() req: IncomingMessage,
  ) {
    return await this.usersService.requestChain(data, req);
  }

  // 연결 ID 요청 승인/거절
  @UseGuards(JwtAuthGuard)
  @Patch('chain/response')
  async responseChain(
    @Body() data: { target: string; status: boolean },
    @Req() req: IncomingMessage,
  ) {
    return await this.usersService.responseChain(data, req);
  }
}
