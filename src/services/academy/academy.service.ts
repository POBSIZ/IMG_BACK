import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AcademyEntity } from './entities/academy.entity';
import { CreateAcademyDto } from './dto/academy.dto';

import { ClassEntity } from './entities/class.entity';
import { IncomingMessage } from 'http';

import jwt from 'jwt-decode';
import { Payload } from '../user/jwt/jwt.payload';
import { UserEntity } from '../user/entities/user.entity';

import { QuizEntity } from '../quiz/entities/quiz.entity';
import { BookEntity } from '../quiz/entities/book.entity';

import { JwtService } from '@nestjs/jwt';
import { CreateClassDto } from './dto/class.dto';
import { UserQuizEntity } from '../user/entities/userQuiz.entity';

@Injectable()
export class AcademyService {
  constructor(
    @InjectRepository(AcademyEntity)
    private readonly academyRepository: Repository<AcademyEntity>,

    @InjectRepository(ClassEntity)
    private readonly classRepository: Repository<ClassEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(QuizEntity)
    private readonly quizRepository: Repository<QuizEntity>,

    @InjectRepository(BookEntity)
    private readonly bookRepository: Repository<BookEntity>,

    @InjectRepository(UserQuizEntity)
    private readonly userQuizRepository: Repository<UserQuizEntity>,

    private jwtService: JwtService,
  ) {}

  // 학원 생성
  async create(reqData: CreateAcademyDto, req: IncomingMessage) {
    try {
      const userInfo: Payload = await jwt(req.headers.authorization);
      const user = await this.userRepository.findOneBy([
        {
          user_id: Number(userInfo.user_id),
        },
      ]);

      const isExist = await this.academyRepository.findOneBy([
        {
          name: reqData.name,
          zip: reqData.zip,
        },
      ]);

      if (isExist === null) {
        const createAcademyDto = new CreateAcademyDto();
        createAcademyDto.name = reqData.name;
        createAcademyDto.president_name = reqData.president_name;
        createAcademyDto.phone = reqData.phone;
        createAcademyDto.address = reqData.address;
        createAcademyDto.zip = reqData.zip;
        createAcademyDto.address_detail = reqData.address_detail;

        const lastAcademy = await this.academyRepository.save(createAcademyDto);

        user.academy_admin = true;
        user.academy_id = lastAcademy;
        await this.userRepository.update(Number(user.user_id), user);

        const payload: Payload = {
          ...user,
          class_id: user?.class_id?.class_id,
          academy_id: user?.academy_id?.academy_id,
          isValidate: true,
        };

        return this.jwtService.sign(payload);
      } else {
        throw new UnauthorizedException('이미 존재하는 학원입니다.');
      }
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 500);
    }
  }

  // 반 생성
  async createClass(
    reqData: Pick<CreateClassDto, 'name'>,
    req: IncomingMessage,
  ) {
    try {
      const userInfo: Payload = await jwt(req.headers.authorization);

      const academy = await this.academyRepository.findOneBy([
        {
          academy_id: Number(userInfo.academy_id),
        },
      ]);

      const createClassDto = new CreateClassDto();
      createClassDto.academy_id = academy;
      createClassDto.name = reqData.name;

      await this.classRepository.save(createClassDto);

      return 'Success';
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 500);
    }
  }

  // 반 모두 불러오기
  async getClassAll(req: IncomingMessage) {
    try {
      const userInfo: Payload = await jwt(req.headers.authorization);

      const classes = await this.classRepository
        .createQueryBuilder('class')
        .where('class.academy_id = :academy_id', {
          academy_id: Number(userInfo.academy_id),
        })
        .getMany();

      return classes;
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 500);
    }
  }

  // 반 삭제하기
  async removeClass(class_id: string, req: IncomingMessage) {
    try {
      const userInfo: Payload = await jwt(req.headers.authorization);

      const selectClass = await this.classRepository
        .createQueryBuilder('class')
        .where('class.academy_id = :academy_id', {
          academy_id: Number(userInfo.academy_id),
        })
        .andWhere('class.class_id = :class_id', { class_id: Number(class_id) })
        .getOne();

      await this.classRepository.remove(selectClass);
      return 'Success';
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 500);
    }
  }

  // 학원 검색
  async search(str: { str: string }) {
    try {
      if (str.str !== '') {
        const academyList = await this.academyRepository.find();
        const srAcademyList = academyList.filter((item) =>
          item.name.includes(str.str),
        );
        return srAcademyList;
      }
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  // 내 학원 정보 불러오기
  async info(req: IncomingMessage) {
    try {
      const userInfo: Payload = await jwt(req.headers.authorization);
      const academy = await this.academyRepository.findOneBy([
        {
          academy_id: Number(userInfo.academy_id),
        },
      ]);
      return academy;
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  // 내 학원 학생 모두 불러오기
  async getAllStudent(req: IncomingMessage) {
    try {
      const userInfo: Payload = await jwt(req.headers.authorization);

      const users = await this.userRepository
        .createQueryBuilder('user')
        .where('user.academy_id = :academy_id', {
          academy_id: Number(userInfo.academy_id),
        })
        .leftJoinAndSelect('user.academy_id', 'academy_id')
        .leftJoinAndSelect('user.class_id', 'class_id')
        .getMany();

      return users.map((item) => ({
        ...item,
        academy_name: item.academy_id.name,
        class_name: item?.class_id?.name,
      }));
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 500);
    }
  }

  // 내 학원 반,학생 모두 불러오기
  async getAllClassStudent(req: IncomingMessage) {
    const convertDateToYMDm = (_date) => {
      const _dateObj = new Date(_date).toISOString();
      const dateObj = new Date(_dateObj);
      return `${dateObj.getFullYear()}/${dateObj.getMonth()}/${dateObj.getDay()} ${dateObj.getHours()}:${dateObj.getMinutes()}`;
    };

    const userInfoGen = async (_users: UserEntity[]) => {
      return await Promise.all(
        _users.map(async (user) => {
          const userQuizs = await this.userQuizRepository
            .createQueryBuilder('uq')
            .where('uq.user_id = :user_id', { user_id: Number(user.user_id) })
            .leftJoinAndSelect('uq.quiz_id', 'quiz_id')
            .getMany();

          return {
            title: user.name,
            data: { ...user },
            list: userQuizs.map((_uq) => ({
              title: `${_uq.quiz_id.title}, ${_uq.best_solve}/${
                _uq.quiz_id.max_words
              }, ${convertDateToYMDm(_uq.recent_date)}`,
              data: { ..._uq },
            })),
          };
        }),
      );
    };

    try {
      const userInfo: Payload = await jwt(req.headers.authorization);

      const classes = await this.classRepository
        .createQueryBuilder('class')
        .where('class.academy_id = :academy_id', {
          academy_id: Number(userInfo.academy_id),
        })
        .getMany();

      const list: any[] = [];

      await Promise.all(
        classes.map(async (item) => {
          const users = await this.userRepository
            .createQueryBuilder('user')
            .where('user.class_id = :class_id', {
              class_id: Number(item.class_id),
            })
            .getMany();

          list.push({
            title: `${item.name} / ${users.length}명`,
            data: { ...item },
            list: await userInfoGen(users),
          });
        }),
      );

      const users = await this.userRepository
        .createQueryBuilder('user')
        .where('user.academy_id = :academy_id', {
          academy_id: Number(userInfo.academy_id),
        })
        .andWhere('user.class_id IS NULL')
        .getMany();

      list.push({
        title: '반 배정안됨',
        data: null,
        list: await userInfoGen(users),
      });

      return list;
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 500);
    }
  }

  // 내 학원 퀴즈 모두 불러오기
  async getAllQuiz(req: IncomingMessage) {
    try {
      const userInfo: Payload = await jwt(req.headers.authorization);

      const quizs = await this.quizRepository
        .createQueryBuilder('quiz')
        .where('quiz.academy_id = :academy_id ', {
          academy_id: Number(userInfo.academy_id),
        })
        .getMany();

      return quizs;
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  // 내 학원 책 모두 불러오기
  async getAllBook(req: IncomingMessage) {
    try {
      const userInfo: Payload = await jwt(req.headers.authorization);

      const books = await this.bookRepository
        .createQueryBuilder('book')
        .where('book.academy_id = :academy_id ', {
          academy_id: Number(userInfo.academy_id),
        })
        .getMany();

      return books;
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }
}
