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
} from '@nestjs/common';

import { UsersService } from './user.service';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from './jwt/jwt.guard';
import { IncomingMessage } from 'http';
import { UpdateUserQuizDto, CreateUserQuizDto } from './dto/userQuiz.dto';
import { UserQuizUpadteData } from './user.types';

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

  // 단일 회원 정보 불러오기
  @UseGuards(JwtAuthGuard)
  @Get('quiz/log')
  async getQuizLog(@Req() req: IncomingMessage) {
    return await this.usersService.getQuizLog(req);
  }
}
