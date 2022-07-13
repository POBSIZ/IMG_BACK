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

import { Roles, UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

import { UserQuizEntity } from './entities/userQuiz.entity';
import { CreateUserQuizDto, UpdateUserQuizDto } from './dto/userQuiz.dto';
import { QuizEntity } from '../quiz/entities/quiz.entity';

import { QuizLogEntity } from './entities/quizLog.entity';
import { CreateQuizLogDto } from './dto/quizLog.dto';

import { WrongEntity } from './entities/wrong.entity';
import { CreateWrongDto } from './dto/wrong.dto';

import { WrongListEntity } from './entities/wrongList.entity';
import { CreateWrongListDto } from './dto/wrongList.dto';

import { ProbEntity } from '../quiz/entities/prob.entity';

import {
  AnswerListItem,
  QuizLogItemType,
  QuizResultType,
  UserQuizUpadteData,
} from './user.types';
import { ConfigService } from '@nestjs/config';
import { AcademyEntity } from '../academy/entities/academy.entity';
import { ClassEntity } from '../academy/entities/class.entity';
import { OptionEntity } from '../quiz/entities/option.entity';
import { AudioEntity } from '../audio/entities/audio.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(UserQuizEntity)
    private readonly userQuizRepository: Repository<UserQuizEntity>,

    @InjectRepository(QuizEntity)
    private readonly quizRepository: Repository<QuizEntity>,

    @InjectRepository(AudioEntity)
    private readonly audioRepository: Repository<AudioEntity>,

    @InjectRepository(ProbEntity)
    private readonly probRepository: Repository<ProbEntity>,

    @InjectRepository(OptionEntity)
    private readonly optionRepository: Repository<OptionEntity>,

    @InjectRepository(QuizLogEntity)
    private readonly quizLogRepository: Repository<QuizLogEntity>,

    @InjectRepository(WrongListEntity)
    private readonly wrongListRepository: Repository<WrongListEntity>,

    @InjectRepository(WrongEntity)
    private readonly wrongRepository: Repository<WrongEntity>,

    @InjectRepository(AcademyEntity)
    private readonly academyRepository: Repository<AcademyEntity>,

    @InjectRepository(ClassEntity)
    private readonly classRepository: Repository<ClassEntity>,

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
        createUserDto.phone = reqData.phone;
        createUserDto.role = Roles[reqData.role.toUpperCase()];

        // 학생
        createUserDto.school = reqData.school;
        createUserDto.grade = reqData.grade;
        createUserDto.class_id = reqData.class_id;

        // 학원 관계자
        createUserDto.address = reqData.address;
        createUserDto.zip = reqData.zip;
        createUserDto.address_detail = reqData.address_detail;

        // Both
        createUserDto.academy_id = reqData.academy_id;

        const salt = 10;
        // const salt = Number(process.env.BCRYPT_SALT);
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
      // console.log(error);
      // throw new HttpException(error, 500);
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
            ...user,
            academy_id: user.academy_id,
            class_id: user.class_id,
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
        { user_id: userInfo.user_id },
      ]);

      const payload: Payload = {
        ...user,
        academy_id: user.academy_id,
        class_id: user.class_id,
        isValidate: true,
      };
      // console.log(payload);
      return this.jwtService.sign(payload);
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 500);
    }
  }

  // 유저퀴즈 생성
  async createUserQuiz(
    data: { users: number[]; quiz_id: number },
    req: IncomingMessage,
  ) {
    try {
      data.users.forEach(async (item) => {
        const createUserQuizDto = new CreateUserQuizDto();

        const user = await this.userRepository.findOneBy([
          {
            user_id: item,
          },
        ]);

        const quiz = await this.quizRepository.findOneBy([
          {
            quiz_id: data.quiz_id,
          },
        ]);

        createUserQuizDto.user_id = user;
        createUserQuizDto.quiz_id = quiz;

        await this.userQuizRepository.save(createUserQuizDto);
      });
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  // 유저퀴즈 정보 업데이트
  async updateUserQuiz(data: UserQuizUpadteData, req: IncomingMessage) {
    try {
      const userInfo: any = await jwt(req.headers.authorization);

      const user = await this.userRepository.findOneBy([
        { user_id: Number(userInfo.user_id) },
      ]);

      const _userQuiz = await this.userQuizRepository
        .createQueryBuilder('userQuiz')
        .leftJoinAndSelect('userQuiz.quiz_id', 'quiz_id')
        .where('userQuiz.user_id = :user_id', { user_id: Number(user.user_id) })
        .andWhere('userQuiz.quiz_id = :quiz_id', {
          quiz_id: Number(data.quiz_id),
        })
        .getOne();

      const upadateUserQuizDto = new UpdateUserQuizDto();
      upadateUserQuizDto.try_count = _userQuiz.try_count + 1;
      if (_userQuiz.best_solve > data.best_solve) {
        upadateUserQuizDto.best_solve = _userQuiz.best_solve;
      } else {
        upadateUserQuizDto.best_solve = Number(data.best_solve);
      }

      await this.userQuizRepository.update(
        Number(_userQuiz.userQuiz_id),
        upadateUserQuizDto,
      );

      const userQuiz = await this.userQuizRepository
        .createQueryBuilder('userQuiz')
        .leftJoinAndSelect('userQuiz.quiz_id', 'quiz_id')
        .where('userQuiz.userQuiz_id = :userQuiz_id', {
          userQuiz_id: Number(_userQuiz.userQuiz_id),
        })
        .getOne();

      const createWrongListDto = new CreateWrongListDto();
      createWrongListDto.userQuiz_id = userQuiz;
      const wrongList = await this.wrongListRepository.save(createWrongListDto);

      const wrongAnswerList = data.answerList.filter(
        (item) => Number(item.answer[0]) !== Number(item.correctWordId),
      );

      await Promise.all(
        wrongAnswerList.map(async (item) => {
          const prob = await this.probRepository
            .createQueryBuilder('prob')
            .where('prob.prob_id = :prob_id', { prob_id: Number(item.prob_id) })
            .getOne();

          const createWrongDto = new CreateWrongDto();
          createWrongDto.wrongList_id = wrongList;
          createWrongDto.prob_id = prob;
          createWrongDto.wrong_word = item.answer[1];
          return await this.wrongRepository.save(createWrongDto);
        }),
      );

      const createQuizLogDto = new CreateQuizLogDto();
      createQuizLogDto.userQuiz_id = userQuiz;
      createQuizLogDto.wrongList_id = wrongList;
      createQuizLogDto.quiz_title = userQuiz.quiz_id.title;
      createQuizLogDto.score = Number(data.best_solve);
      createQuizLogDto.max_words = Number(userQuiz.quiz_id.max_words);
      const quizLog = await this.quizLogRepository.save(createQuizLogDto);
      // console.log(quizLog);

      return 'Success';
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 500);
    }
  }

  // 학생 회원 정보 모두 가져오기
  async getAllStudentUser(req: IncomingMessage) {
    try {
      const userInfo: Payload = await jwt(req.headers.authorization);
      if (userInfo.role !== 'admin') {
        throw new HttpException('관리자가 아닙니다.', 400);
      }
      const users = await this.userRepository
        .createQueryBuilder('user')
        .where('user.role = :role', { role: Roles.STUDENT })
        .getMany();
      const filterdUsers = users.map((item) => ({
        ...item,
        password: '',
        username: '',
      }));
      return filterdUsers;
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  // 회원 정보 모두 가져오기
  async getAllUser(req: IncomingMessage) {
    try {
      const userInfo: Payload = await jwt(req.headers.authorization);
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

  // 퀴즈 로그 불러오기
  async getQuizLog(req: IncomingMessage) {
    const userInfo: any = await jwt(req.headers.authorization);

    const userQuizs = await this.userQuizRepository
      .createQueryBuilder('userQuiz')
      .leftJoinAndSelect('userQuiz.user_id', 'user_id')
      .leftJoinAndSelect('userQuiz.quiz_id', 'quiz_id')
      .where('userQuiz.user_id = :user_id', {
        user_id: Number(userInfo.user_id),
      })
      .getMany();

    const data = await Promise.all(
      userQuizs.map(async (_userQuiz) => {
        const quizLogs = await this.quizLogRepository
          .createQueryBuilder('quizLog')
          .leftJoinAndSelect('quizLog.userQuiz_id', 'userQuiz_id')
          .where('quizLog.userQuiz_id = :userQuiz_id', {
            userQuiz_id: Number(_userQuiz.userQuiz_id),
          })
          .getMany();

        return await Promise.all(
          quizLogs.map(async (_quizLog) => {
            return {
              quiz_id: _userQuiz.quiz_id.quiz_id,
              quizLog_id: _quizLog.quizLog_id,
              userQuiz_id: _userQuiz.userQuiz_id,
              date: _quizLog.created_at,
              title: _quizLog.quiz_title,
              score: _quizLog.score,
              probCount: _quizLog.max_words,
            };
          }),
        );
      }),
    );

    return data;
  }

  // 퀴즈 오답 불러오기
  /**
   *
   * @param {string} param quizLog_id
   * @param {IncomingMessage} req
   */
  async getWrongList(id: string, req: IncomingMessage) {
    try {
      const userInfo: Payload = await jwt(req.headers.authorization);

      const quizLog = await this.quizLogRepository
        .createQueryBuilder('quizLog')
        .where('quizLog.quizLog_id = :quizLog_id', { quizLog_id: Number(id) })
        .leftJoinAndSelect('quizLog.wrongList_id', 'wrongList_id')
        .leftJoinAndSelect('quizLog.userQuiz_id', 'userQuiz_id')
        .leftJoinAndSelect('userQuiz_id.quiz_id', 'quiz_id')
        .getOne();

      const wrongs = await this.wrongRepository
        .createQueryBuilder('wrong')
        .where('wrong.wrongList_id = :wrongList_id', {
          wrongList_id: quizLog.wrongList_id.wrongList_id,
        })
        .leftJoinAndSelect('wrong.prob_id', 'prob_id')
        .getMany();

      const worngIdList = await Promise.all(
        wrongs.map((item) => item.prob_id.prob_id),
      );

      const probs = await this.probRepository
        .createQueryBuilder('prob')
        .where('prob.quiz_id = :quiz_id', {
          quiz_id: quizLog.userQuiz_id.quiz_id.quiz_id,
        })
        .leftJoinAndSelect('prob.quiz_id', 'quiz_id')
        .leftJoinAndSelect('prob.word_id', 'word_id')
        .getMany();

      const list: AnswerListItem[] = await Promise.all(
        probs.map(async (item, i) => {
          const isWrong = worngIdList.includes(item.prob_id);
          const wrongWord = wrongs.filter(
            (wrong) => Number(wrong.prob_id.prob_id) === Number(item.prob_id),
          )[0]?.wrong_word;

          const audio = await this.audioRepository
            .createQueryBuilder('audio')
            .where('audio.word_id = :word_id', {
              word_id: item.word_id.word_id,
            })
            .getOne();

          const options = await this.optionRepository
            .createQueryBuilder('option')
            .where('option.prob_id = :prob_id', {
              prob_id: Number(item.prob_id),
            })
            .leftJoinAndSelect('option.word_id', 'word_id')
            .getMany();

          const optionList = await Promise.all(
            options.map((item) => item.word_id.meaning),
          );

          const answer: [number, string] = isWrong
            ? [optionList.indexOf(wrongWord), wrongWord]
            : [optionList.indexOf(item.word_id.meaning), item.word_id.meaning];

          return {
            id: i,
            prob_id: Number(item.prob_id),
            answer: answer,
            correctWordId: optionList.indexOf(item.word_id.meaning),
            correctWord: item.word_id.word,
            options: optionList,
            diacritic: item.word_id.diacritic,
            audio: audio.url,
          };
        }),
      );

      const data: QuizResultType = {
        id: Number(quizLog.userQuiz_id.quiz_id.quiz_id),
        title: quizLog.userQuiz_id.quiz_id.title,
        list: list,
        corrCount: quizLog.score,
      };

      return data;
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 500);
    }
  }
}
