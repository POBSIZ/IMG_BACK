import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { Payload } from './jwt/jwt.payload';
import { IncomingMessage } from 'http';
import jwt from 'jwt-decode';

import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

import { UserQuizEntity } from './entities/userQuiz.entity';
import { UpdateUserQuizDto } from './dto/userQuiz.dto';
import { QuizEntity } from '../quiz/entities/quiz.entity';

import { QuizLogEntity } from './entities/quizLog.entity';
import { CreateQuizLogDto } from './dto/quizLog.dto';

import { WrongEntity } from './entities/wrong.entity';
import { CreateWrongDto } from './dto/wrong.dto';

import { WrongListEntity } from './entities/wrongList.entity';
import { CreateWrongListDto } from './dto/wrongList.dto';

import { ProbEntity } from '../quiz/entities/prob.entity';

import { QuizLogItemType, UserQuizUpadteData } from './user.types';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(UserQuizEntity)
    private readonly userQuizRepository: Repository<UserQuizEntity>,

    @InjectRepository(QuizEntity)
    private readonly quizRepository: Repository<QuizEntity>,

    @InjectRepository(ProbEntity)
    private readonly probRepository: Repository<ProbEntity>,

    @InjectRepository(QuizLogEntity)
    private readonly quizLogRepository: Repository<QuizLogEntity>,

    @InjectRepository(WrongListEntity)
    private readonly wrongListRepository: Repository<WrongListEntity>,

    @InjectRepository(WrongEntity)
    private readonly wrongRepository: Repository<WrongEntity>,

    private readonly configService: ConfigService,

    private jwtService: JwtService,
  ) {}

  // 회원가입
  async register(reqData: CreateUserDto) {
    const isExist = await this.userRepository.findOneBy([
      { username: reqData.username },
    ]);

    const createUserDto = new CreateUserDto();
    try {
      if (isExist === null) {
        createUserDto.name = reqData.name;
        createUserDto.username = reqData.username;
        createUserDto.school = reqData.school;
        createUserDto.grade = reqData.grade;
        createUserDto.phone = reqData.phone;

        const salt = Number(process.env.BCRYPT_SALT);
        const password = await bcrypt.hash(reqData.password, salt);
        createUserDto.password = password;

        await this.userRepository.save(createUserDto);
        return '회원가입에 성공하였습니다.';
      } else {
        throw new UnauthorizedException('', '이미 존재하는 아이디입니다.');
      }
    } catch (error) {
      throw new HttpException(
        error.response.message,
        error.response.statusCode,
      );
    }
  }

  // 로그인
  async login(reqData: LoginUserDto) {
    try {
      const user = await this.userRepository.findOneBy([
        { username: reqData.username },
      ]);

      if (user) {
        const isPasswordMatching = await bcrypt.compare(
          reqData.password,
          user.password,
        );

        if (isPasswordMatching) {
          const payload: Payload = {
            id: user.user_id,
            name: user.name,
            school: user.school,
            grade: user.grade,
            phone: user.phone,
            role: user.role,
            isValidate: true,
          };
          return this.jwtService.sign(payload);
        } else {
          throw new UnauthorizedException('인증되지 않은 사용자입니다.');
        }
      } else {
        throw new UnauthorizedException('존재하지 않는 사용자입니다.');
      }
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 500);
    }
  }

  // 토큰 유효성 검사
  async validate(req: IncomingMessage) {
    try {
      const userInfo: any = await jwt(req.headers.authorization);
      const user = await this.userRepository.findOneBy([
        { user_id: userInfo.id },
      ]);

      const payload: Payload = {
        id: user.user_id,
        name: user.name,
        school: user.school,
        grade: user.grade,
        phone: user.phone,
        role: user.role,
        isValidate: true,
      };

      return this.jwtService.sign(payload);
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  // 회원퀴즈 정보 업데이트
  async updateUserQuiz(data: UserQuizUpadteData, req: IncomingMessage) {
    try {
      const userInfo: any = await jwt(req.headers.authorization);

      const user = await this.userRepository.findOneBy([
        { user_id: userInfo.id },
      ]);

      const userQuiz = await this.userQuizRepository
        .createQueryBuilder('userQuiz')
        .leftJoinAndSelect('userQuiz.quiz_id', 'quiz_id')
        .where('userQuiz.user_id = :user_id', { user_id: user.user_id })
        .where('userQuiz.quiz_id = :quiz_id', { quiz_id: data.quiz_id })
        .getOne();

      const upadateUserQuizDto = new UpdateUserQuizDto();
      upadateUserQuizDto.try_count = userQuiz.try_count + 1;
      if (userQuiz.best_solve > data.best_solve) {
        upadateUserQuizDto.best_solve = userQuiz.best_solve;
      } else {
        upadateUserQuizDto.best_solve = data.best_solve;
      }

      await this.userQuizRepository.update(
        Number(userQuiz.userQuiz_id),
        upadateUserQuizDto,
      );

      const createWrongListDto = new CreateWrongListDto();
      createWrongListDto.userQuiz_id = userQuiz;
      const wrongList = await this.wrongListRepository.save(createWrongListDto);

      const wrongAnswerList = data.answerList.filter(
        (item) => item.answer[0] !== item.correctWordId,
      );

      wrongAnswerList.forEach(async (item) => {
        const prob = await this.probRepository
          .createQueryBuilder('prob')
          .where('prob.prob_id = :prob_id', { prob_id: item.prob_id })
          .getOne();

        const createWrongDto = new CreateWrongDto();
        createWrongDto.wrongList_id = wrongList;
        createWrongDto.prob_id = prob;
        createWrongDto.wrong_word = item.answer[1];
        await this.wrongRepository.save(createWrongDto);
      });

      const createQuizLogDto = new CreateQuizLogDto();
      createQuizLogDto.score = data.best_solve;
      createQuizLogDto.userQuiz_id = userQuiz;
      createQuizLogDto.wrongList_id = wrongList;
      const quizLog = await this.quizLogRepository.save(createQuizLogDto);
      // console.log(quizLog);

      return;
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 500);
    }
  }

  // 회원 정보 모두 가져오기
  async getAllUser(req: IncomingMessage) {
    try {
      const userInfo: any = await jwt(req.headers.authorization);
      if (userInfo.role !== 'admin') {
        throw new HttpException('관리자가 아닙니다.', 400);
      }
      const users = await this.userRepository.find();
      return users;
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  // 단일 회원 정보 가져오기
  async getUserInfo(param, req: IncomingMessage) {
    try {
      const userInfo: any = await jwt(req.headers.authorization);
      if (userInfo.role !== 'admin') {
        throw new HttpException('관리자가 아닙니다.', 400);
      }
      const user = await this.userRepository.findOneBy([{ user_id: param.id }]);
      return user;
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  async getQuizLog(req: IncomingMessage) {
    const userInfo: any = await jwt(req.headers.authorization);

    const userQuizs = await this.userQuizRepository
      .createQueryBuilder('userQuiz')
      .leftJoinAndSelect('userQuiz.quiz_id', 'quiz_id')
      .leftJoinAndSelect('userQuiz.user_id', 'user_id')
      .where('userQuiz.user_id = :user_id', { user_id: userInfo.id })
      .getMany();

    const data = await Promise.all(
      userQuizs.map(async (_userQuiz) => {
        const quizLogs = await this.quizLogRepository
          .createQueryBuilder('quizLog')
          .where('quizLog.userQuiz_id = :userQuiz_id', {
            userQuiz_id: _userQuiz.userQuiz_id,
          })
          .getMany();

        return await Promise.all(
          quizLogs.map(async (_quizLog) => {
            return {
              quizLog_id: _quizLog.quizLog_id,
              userQuiz_id: _userQuiz.userQuiz_id,
              date: _quizLog.created_at,
              title: _userQuiz.quiz_id.title,
              score: _quizLog.score,
              probCount: _userQuiz.quiz_id.max_words,
            };
          }),
        );
      }),
    );

    // console.log(data);

    return data;
  }
}
