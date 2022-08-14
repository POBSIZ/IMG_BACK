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
import * as XLSX from 'xlsx';

import { Roles, UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

import { UserQuizEntity } from './entities/userQuiz.entity';
import { CreateUserQuizDto, UpdateUserQuizDto } from './dto/userQuiz.dto';
import { QuizEntity, QuizType } from '../quiz/entities/quiz.entity';

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
import { Response } from 'express';
import { WordEntity } from '../quiz/entities/word.entity';
import { CreateSolvedProbDto } from './dto/solvedProb.dto';
import { SolvedProbEntity } from './entities/solvedProb.entity';
import { CreateProbLogDto } from './dto/probLog.dto';
import { ProbLogEntity } from './entities/probLog.entity';
import { setPayload } from 'src/utils';
import { Database } from '@adminjs/prisma';

const SALT = 10;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(UserQuizEntity)
    private readonly userQuizRepository: Repository<UserQuizEntity>,

    @InjectRepository(QuizEntity)
    private readonly quizRepository: Repository<QuizEntity>,

    @InjectRepository(WordEntity)
    private readonly wordRepository: Repository<WordEntity>,

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

    @InjectRepository(SolvedProbEntity)
    private readonly solvedProbRepository: Repository<SolvedProbEntity>,

    @InjectRepository(ProbLogEntity)
    private readonly probLogRepository: Repository<ProbLogEntity>,

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
        createUserDto.nickname = reqData.nickname;
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

        // const salt = Number(process.env.BCRYPT_SALT);
        const password = await bcrypt.hash(reqData.password, SALT);
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
      const user = await this.userRepository
        .createQueryBuilder('user')
        .where('user.username = :username', { username: reqData.username })
        .getOne();
      // .leftJoinAndSelect('user.academy_id', 'academy_id')

      if (user) {
        const isPasswordMatching = await bcrypt.compare(
          reqData.password,
          user.password,
        );

        if (isPasswordMatching) {
          if (user.academy_id !== null) {
            const academy_user = await this.userRepository
              .createQueryBuilder('user')
              .where('user.username = :username', {
                username: reqData.username,
              })
              .leftJoinAndSelect('user.academy_id', 'academy_id')
              .getOne();

            const payload = setPayload(academy_user);
            return this.jwtService.sign(payload);
          } else {
            const payload = setPayload(user);
            return this.jwtService.sign(payload);
          }
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
      const user = await this.userRepository
        .createQueryBuilder('user')
        .where('user.user_id = :user_id', { user_id: userInfo.user_id })
        .leftJoinAndSelect('user.academy_id', 'academy_id')
        .getOne();

      const payload: Payload = setPayload(user);

      return this.jwtService.sign(payload);
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 500);
    }
  }

  // 비밀번호 재설정 검사
  async validatePassword(data: { username: string; phone: string }, req) {
    try {
      const user = await this.userRepository
        .createQueryBuilder('usr')
        .where('usr.username = :username', { username: data.username })
        .andWhere('usr.phone = :phone', { phone: data.phone })
        .getOne();

      if (user) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  // 비밀번호 재설정
  async changePassword(
    data: { username: string; phone: string; password: string },
    req,
  ) {
    try {
      const user = await this.userRepository
        .createQueryBuilder('usr')
        .where('usr.username = :username', { username: data.username })
        .andWhere('usr.phone = :phone', { phone: data.phone })
        .getOne();

      const password = await bcrypt.hash(data.password, SALT);
      user.password = password;

      await this.userRepository.update(Number(user.user_id), user);
      return true;
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  // 유저 정보 수정
  async patchUser(
    data: {
      user_id: string;
      name: string;
      nickname: string;
      academy_id: string;
      school: string;
      grade: string;
      phone: string;
    },
    req: IncomingMessage,
  ) {
    try {
      // const userInfo: any = await jwt(req.headers.authorization);
      const user = await this.userRepository.findOneBy([
        { user_id: Number(data.user_id) },
      ]);

      const academy = await this.academyRepository.findOneBy([
        {
          academy_id: Number(data.academy_id),
        },
      ]);

      user.name = data.name;
      user.nickname = data.nickname;
      user.academy_id = academy;
      user.school = data.school;
      user.grade = data.grade;
      user.phone = data.phone;

      await this.userRepository.update(Number(user.user_id), user);
      return 'success';
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 500);
    }
  }

  // 학생 반 배정
  async setStudentClass(
    data: { class_id: string; user_id: string[] },
    req: IncomingMessage,
  ) {
    try {
      const userInfo: Payload = await jwt(req.headers.authorization);

      data.user_id.forEach(async (item) => {
        const user = await this.userRepository.findOneBy([
          { user_id: Number(item) },
        ]);

        const studentClass = await this.classRepository.findOneBy([
          {
            class_id: Number(data.class_id),
          },
        ]);

        user.class_id = studentClass;

        await this.userRepository.update(Number(user.user_id), user);
      });
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
            user_id: Number(item),
          },
        ]);

        const quiz = await this.quizRepository.findOneBy([
          {
            quiz_id: Number(data.quiz_id),
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

      // - 유저 퀴즈 업데이트
      const _userQuiz = await this.userQuizRepository
        .createQueryBuilder('userQuiz')
        .leftJoinAndSelect('userQuiz.quiz_id', 'quiz_id')
        .where('userQuiz.userQuiz_id = :userQuiz_id', {
          userQuiz_id: Number(data.userQuiz_id),
        })
        .getOne();

      const upadateUserQuizDto = new UpdateUserQuizDto();
      upadateUserQuizDto.try_count = _userQuiz.try_count + 1;

      // 최고 기록 갱신 시 업데이트
      if (_userQuiz.best_solve > data.best_solve) {
        upadateUserQuizDto.best_solve = _userQuiz.best_solve;
      } else {
        upadateUserQuizDto.best_solve = Number(data.best_solve);
      }

      await this.userQuizRepository.update(
        Number(_userQuiz.userQuiz_id),
        upadateUserQuizDto,
      );

      // - 오답 목록 생성
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

      // - 오답 문제 생성
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

      // - 퀴즈 로그 생성
      const createQuizLogDto = new CreateQuizLogDto();
      createQuizLogDto.user_id = user;
      createQuizLogDto.userQuiz_id = userQuiz;
      createQuizLogDto.wrongList_id = wrongList;
      createQuizLogDto.quiz_title = userQuiz.quiz_id.title;
      createQuizLogDto.score = Number(data.best_solve);
      createQuizLogDto.max_words = Number(userQuiz.quiz_id.max_words);
      createQuizLogDto.time = Number(userQuiz.quiz_id.time);
      const quizLog = await this.quizLogRepository.save(createQuizLogDto);

      // - 푼 문제 & 문제 로그 생성
      if (userQuiz.quiz_id.type === QuizType.EX_PREV) {
        const solvedProbCount = await this.solvedProbRepository
          .createQueryBuilder('sp')
          .where('sp.userQuiz_id = :userQuiz_id', {
            userQuiz_id: userQuiz.userQuiz_id,
          })
          .getManyAndCount();

        // -- 문제 목록 보다 푼 문제의 길이가 클 경우 푼 문제 목록 초기화
        if (
          solvedProbCount[1] + userQuiz.quiz_id.available_counts >=
          userQuiz.quiz_id.max_words
        ) {
          solvedProbCount[0].forEach(async (sp) => {
            await sp.remove();
          });
        }

        // -- 푼 문제 생성
        data.answerList.forEach(async (item) => {
          const prob = await this.probRepository.findOneBy([
            { prob_id: Number(item.prob_id) },
          ]);

          const createSolvedProbDto = new CreateSolvedProbDto();
          createSolvedProbDto.userQuiz_id = userQuiz;
          createSolvedProbDto.prob_id = prob;
          await this.solvedProbRepository.save(createSolvedProbDto);
        });
      }

      // - 문제 로그 생성
      data.answerList.forEach(async (item) => {
        const prob = await this.probRepository.findOneBy([
          { prob_id: Number(item.prob_id) },
        ]);

        const createProbLogDto = new CreateProbLogDto();
        createProbLogDto.quizLog_id = quizLog;
        createProbLogDto.prob_id = prob;
        await this.probLogRepository.save(createProbLogDto);
      });

      return 'Success';
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 500);
    }
  }

  // 유저퀴즈 삭제
  async deleteUserQuiz(uqid: string, req: IncomingMessage) {
    try {
      const userInfo: any = await jwt(req.headers.authorization);

      const userQuiz = await this.userQuizRepository.findOneBy([
        { userQuiz_id: Number(uqid) },
      ]);

      userQuiz.disabled = true;

      await this.userQuizRepository.update(Number(uqid), userQuiz);

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
      // if (userInfo.role !== 'admin') {
      //   throw new HttpException('관리자가 아닙니다.', 400);
      // }

      const user = await this.userRepository
        .createQueryBuilder('usr')
        .where('usr.user_id = :user_id', { user_id: Number(param.id) })
        .leftJoinAndSelect('usr.academy_id', 'academy_id')
        .getOne();

      return user;
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  // 퀴즈 로그 불러오기
  async getQuizLog(req: IncomingMessage) {
    try {
      const userInfo: Payload = await jwt(req.headers.authorization);

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
                probCount: _userQuiz.quiz_id.available_counts,
              };
            }),
          );
        }),
      );

      const noneUqLogs = await this.quizLogRepository
        .createQueryBuilder('ql')
        .where('ql.user_id = :user_id', { user_id: Number(userInfo.user_id) })
        .andWhere('ql.userQuiz_id IS NULL')
        .getMany();

      const noneUqLogList = await Promise.all(
        noneUqLogs.map(async (item) => {
          const probCount = await this.probLogRepository
            .createQueryBuilder('pl')
            .where('pl.quizLog_id = :quizLog_id', {
              quizLog_id: Number(item.quizLog_id),
            })
            .getCount();

          return {
            quiz_id: NaN,
            quizLog_id: item.quizLog_id,
            userQuiz_id: NaN,
            date: item.created_at,
            title: item.quiz_title,
            score: item.score,
            probCount: probCount,
          };
        }),
      );

      data.push(noneUqLogList);

      return data;
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 500);
    }
  }

  // 연결 계정 퀴즈 로그 불러오기
  async getChainQuizLog(id: string, req: IncomingMessage) {
    try {
      const userInfo: any = await jwt(req.headers.authorization);

      const userQuizs = await this.userQuizRepository
        .createQueryBuilder('userQuiz')
        .leftJoinAndSelect('userQuiz.user_id', 'user_id')
        .leftJoinAndSelect('userQuiz.quiz_id', 'quiz_id')
        .where('userQuiz.user_id = :user_id', {
          user_id: Number(id),
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
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 500);
    }
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
          wrongList_id: Number(quizLog.wrongList_id.wrongList_id),
        })
        .leftJoinAndSelect('wrong.prob_id', 'prob_id')
        .getMany();

      // - 오답 id 목록 생성
      const worngIdList = await Promise.all(
        wrongs.map((item) => item.prob_id.prob_id),
      );

      // - 문제 로그 불러오기
      const probLogs = await this.probLogRepository
        .createQueryBuilder('pl')
        .where('pl.quizLog_id = :quizLog_id', { quizLog_id: Number(id) })
        .leftJoinAndSelect('pl.prob_id', 'prob_id')
        .leftJoinAndSelect('prob_id.word_id', 'word_id')
        .getMany();

      // - 결과 리스트 생성
      const list: AnswerListItem[] = await Promise.all(
        probLogs.map(async (_probLog, i) => {
          // -- 오답 id 목록에 문제가 포함되있는가
          const isWrong = worngIdList.includes(_probLog.prob_id.prob_id);

          // -- 오답 단어 생성
          const wrongWord = wrongs.filter(
            (wrong) =>
              Number(wrong.prob_id.prob_id) ===
              Number(_probLog.prob_id.prob_id),
          )[0]?.wrong_word;

          const audio = await this.audioRepository
            .createQueryBuilder('audio')
            .where('audio.word_id = :word_id', {
              word_id: _probLog.prob_id.word_id.word_id,
            })
            .getOne();

          const options = await this.optionRepository
            .createQueryBuilder('option')
            .where('option.prob_id = :prob_id', {
              prob_id: Number(_probLog.prob_id.prob_id),
            })
            .leftJoinAndSelect('option.word_id', 'word_id')
            .getMany();

          // -- 문항 뜻만 추출
          const optionList = await Promise.all(
            options.map((_option) => _option.word_id.meaning),
          );

          // -- 사용자가 선택한 답변
          const answer: [number, string] = isWrong
            ? [optionList.indexOf(wrongWord), wrongWord]
            : [
                optionList.indexOf(_probLog.prob_id.word_id.meaning),
                _probLog.prob_id.word_id.meaning,
              ];

          return {
            id: i,
            prob_id: Number(_probLog.prob_id),
            answer: answer,
            correctWordId: optionList.indexOf(_probLog.prob_id.word_id.meaning),
            correctWord: _probLog.prob_id.word_id.word,
            options: optionList,
            diacritic: _probLog.prob_id.word_id.diacritic,
            audio: audio.url,
          };
        }),
      );

      const data: QuizResultType = {
        id: Number(quizLog.quizLog_id),
        title: quizLog.quiz_title,
        list: list,
        corrCount: quizLog.score,
      };

      return data;
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 500);
    }
  }

  // 오답 목록 엑셀 다운 받기
  async getWrongListExcel(id: string, req: IncomingMessage, res: Response) {
    try {
      const quizLog = await this.quizLogRepository
        .createQueryBuilder('quizLog')
        .where('quizLog.quizLog_id = :quizLog_id', { quizLog_id: Number(id) })
        .leftJoinAndSelect('quizLog.wrongList_id', 'wrongList_id')
        .getOne();

      const wrongs = await this.wrongRepository
        .createQueryBuilder('wrong')
        .where('wrong.wrongList_id = :wrongList_id', {
          wrongList_id: Number(quizLog.wrongList_id.wrongList_id),
        })
        .leftJoinAndSelect('wrong.prob_id', 'prob_id')
        .leftJoinAndSelect('prob_id.word_id', 'word_id')
        .getMany();

      const wordList = await Promise.all(
        wrongs.map(async (item) => {
          return {
            단어: item.prob_id.word_id.word,
            발음: item.prob_id.word_id.diacritic,
            주요뜻: item.prob_id.word_id.meaning,
            메모: item.prob_id.word_id.type,
          };
        }),
      );

      // 엑셀 생성
      const wb = XLSX.utils.book_new();
      const newWorksheet = XLSX.utils.json_to_sheet(wordList);
      XLSX.utils.book_append_sheet(wb, newWorksheet, '');
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'base64' });

      // 엑셀 전송
      res.end(Buffer.from(wbout, 'base64'));
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  // 연결 ID 요청
  async requestChain(data: { target: string }, req: IncomingMessage) {
    try {
      const userInfo: Payload = await jwt(req.headers.authorization);

      const targetUser = await this.userRepository
        .createQueryBuilder('user')
        .where('user.username = :username', { username: data.target })
        .getOne();

      targetUser.chain_id = userInfo.user_id;

      await this.userRepository.update(Number(targetUser.user_id), targetUser);

      return 'Success';
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  // 연결 ID 요청 승인 | 거절
  async responseChain(
    data: { target: string; status: boolean },
    req: IncomingMessage,
  ) {
    try {
      const userInfo: Payload = await jwt(req.headers.authorization);

      const user = await this.userRepository
        .createQueryBuilder('user')
        .where('user.user_id = :user_id', { user_id: Number(userInfo.user_id) })
        .getOne();

      user.chain_id = null;

      const targetUser = await this.userRepository
        .createQueryBuilder('user')
        .where('user.user_id = :user_id', { user_id: Number(data.target) })
        .getOne();

      if (data.status) {
        targetUser.chain_id = Number(userInfo.user_id);
        await this.userRepository.update(
          Number(targetUser.user_id),
          targetUser,
        );
      }

      await this.userRepository.update(Number(user.user_id), user);

      return 'Success';
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }
}
