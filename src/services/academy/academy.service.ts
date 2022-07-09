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
  ) {}

  // 학원 생성
  async create(reqData: CreateAcademyDto, req: IncomingMessage) {
    try {
      const userInfo: Payload = await jwt(req.headers.authorization);
      const user = await this.userRepository.findOneBy([
        {
          user_id: userInfo.user_id,
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

        return `Create ${reqData.name} Academy`;
      } else {
        throw new UnauthorizedException('이미 존재하는 학원입니다.');
      }
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
        .getMany();

      return users;
    } catch (error) {
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
