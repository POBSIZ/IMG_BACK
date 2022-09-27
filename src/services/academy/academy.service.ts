import {
  HttpException,
  Injectable,
  Logger,
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
import { dateSort, formatDate, setPayload } from 'src/utils';
import { PageEntity } from './entities/page.entity';
import { PageBoardEntity } from './entities/pageBoard.entity';
import { CreatePageDto } from './dto/page.dto';
import { CreateBoardDto } from '../board/dto/board.dto';
import { BoardEntity } from '../board/entities/board.entity';
import { CreatePageBoardDto } from './dto/pageBoard.dto';
import { QuizLogEntity } from '../user/entities/quizLog.entity';
import { ProbLogEntity } from '../user/entities/probLog.entity';

@Injectable()
export class AcademyService {
  private logger = new Logger('AcademyService');

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

    @InjectRepository(PageEntity)
    private readonly pageRepository: Repository<PageEntity>,

    @InjectRepository(PageBoardEntity)
    private readonly pageBoardRepository: Repository<PageBoardEntity>,

    @InjectRepository(BoardEntity)
    private readonly boardRepository: Repository<BoardEntity>,

    @InjectRepository(QuizLogEntity)
    private readonly quizLogRepository: Repository<QuizLogEntity>,

    @InjectRepository(ProbLogEntity)
    private readonly probLogRepository: Repository<ProbLogEntity>,

    private jwtService: JwtService,
  ) {}

  // 학원 생성
  async create(reqData: CreateAcademyDto, req: IncomingMessage) {
    try {
      const userInfo: Payload = await jwt(req.headers.authorization);
      const user = await this.userRepository
        .createQueryBuilder('user')
        .where('user.user_id = :user_id', {
          user_id: Number(userInfo.user_id),
        })
        .leftJoinAndSelect('user.academy_id', 'academy_id')
        .getOne();

      // - 학원 존재 유무
      const isExist = await this.academyRepository.findOneBy([
        {
          name: reqData.name,
          zip: reqData.zip,
        },
      ]);

      if (isExist !== null) {
        throw new UnauthorizedException('이미 존재하는 학원입니다.');
      }

      // - 학원생성
      const createAcademyDto = new CreateAcademyDto();
      createAcademyDto.name = reqData.name;
      createAcademyDto.president_name = reqData.president_name;
      createAcademyDto.phone = reqData.phone;
      createAcademyDto.address = reqData.address;
      createAcademyDto.zip = reqData.zip;
      createAcademyDto.address_detail = reqData.address_detail;
      const lastAcademy = await this.academyRepository.save(createAcademyDto);

      // - 학원 페이지 생성
      const createPageDto = new CreatePageDto();
      createPageDto.academy_id = lastAcademy;
      createPageDto.title = reqData.name;
      createPageDto.banner = '';
      createPageDto.bg = '#fff';
      createPageDto.template = 'default';
      const lastPage = await this.pageRepository.save(createPageDto);

      // -- 공지 게시판 생성
      const createBoardDtoNotice = new CreateBoardDto();
      createBoardDtoNotice.title = '공지';
      createBoardDtoNotice.desc = `${reqData.name} 공지`;
      const notice = await this.boardRepository.save(createBoardDtoNotice);

      // -- 소식 게시판 생성
      const createBoardDtoMessage = new CreateBoardDto();
      createBoardDtoMessage.title = '소식';
      createBoardDtoMessage.desc = `${reqData.name} 소식`;
      const message = await this.boardRepository.save(createBoardDtoMessage);

      // -- 학원 공지 게시판 생성
      const createPageBoardDtoNotice = new CreatePageBoardDto();
      createPageBoardDtoNotice.page_id = lastPage;
      createPageBoardDtoNotice.board_id = notice;
      await this.pageBoardRepository.save(createPageBoardDtoNotice);

      // -- 학원 소식 게시판 생성
      const createPageBoardDtoMessage = new CreatePageBoardDto();
      createPageBoardDtoMessage.page_id = lastPage;
      createPageBoardDtoMessage.board_id = message;
      await this.pageBoardRepository.save(createPageBoardDtoMessage);

      // - 원장 학원 정보 주입 업데이트
      user.academy_admin = true;
      user.academy_id = lastAcademy;
      await this.userRepository.update(Number(user.user_id), user);

      // - 업데이트된 유저 정보 전송
      const payload: Payload = setPayload(user);
      return this.jwtService.sign(payload);
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 500);
    }
  }

  // 학원 페이지 생성
  async createPage(academyId: string, req: IncomingMessage) {
    try {
      const academy = await this.academyRepository
        .createQueryBuilder('aca')
        .where('aca.name = :name', {
          name: academyId,
        })
        .getOne();

      // - 학원 페이지 생성
      const createPageDto = new CreatePageDto();
      createPageDto.academy_id = academy;
      createPageDto.title = academy.name;
      createPageDto.banner = '';
      createPageDto.bg = '#fff';
      createPageDto.template = 'default';
      const lastPage = await this.pageRepository.save(createPageDto);

      // -- 공지 게시판 생성
      const createBoardDtoNotice = new CreateBoardDto();
      createBoardDtoNotice.title = '공지';
      createBoardDtoNotice.desc = `${academy.name} 공지`;
      const notice = await this.boardRepository.save(createBoardDtoNotice);

      // -- 소식 게시판 생성
      const createBoardDtoMessage = new CreateBoardDto();
      createBoardDtoMessage.title = '소식';
      createBoardDtoMessage.desc = `${academy.name} 소식`;
      const message = await this.boardRepository.save(createBoardDtoMessage);

      // -- 학원 공지 게시판 생성
      const createPageBoardDtoNotice = new CreatePageBoardDto();
      createPageBoardDtoNotice.page_id = lastPage;
      createPageBoardDtoNotice.board_id = notice;
      await this.pageBoardRepository.save(createPageBoardDtoNotice);

      // -- 학원 소식 게시판 생성
      const createPageBoardDtoMessage = new CreatePageBoardDto();
      createPageBoardDtoMessage.page_id = lastPage;
      createPageBoardDtoMessage.board_id = message;
      await this.pageBoardRepository.save(createPageBoardDtoMessage);

      const pageBoards = await this.pageBoardRepository
        .createQueryBuilder('pb')
        .where('pb.page_id = :page_id', {
          page_id: lastPage.page_id,
        })
        .leftJoinAndSelect('pb.board_id', 'board_id')
        .getMany();

      const data = { ...lastPage, boards: pageBoards };

      return data;
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  // 학원 페이지 불러오기
  async getPage(academyId: string, req: IncomingMessage) {
    try {
      const page = await this.pageRepository
        .createQueryBuilder('page')
        .leftJoinAndSelect('page.academy_id', 'academy_id')
        .where('academy_id.name = :name', {
          name: academyId,
        })
        .getOne();

      const pageBoards = await this.pageBoardRepository
        .createQueryBuilder('pb')
        .where('pb.page_id = :page_id', {
          page_id: page.page_id,
        })
        .leftJoinAndSelect('pb.board_id', 'board_id')
        .getMany();

      const data = { ...page, boards: pageBoards };

      return data;
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error, 500);
    }
  }

  // 학원 정보 수정
  async patchAcademy(reqData: Partial<AcademyEntity>, req: IncomingMessage) {
    try {
      const academy = await this.academyRepository.findOneBy([
        { academy_id: Number(reqData.academy_id) },
      ]);

      academy.name = reqData.name;
      academy.address = reqData.address;
      academy.address_detail = reqData.address_detail;
      academy.zip = reqData.zip;
      academy.phone = reqData.phone;

      await this.academyRepository.update(Number(academy.academy_id), academy);
      return 'success';
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error, 500);
    }
  }

  // 모든 학원 불러오기
  async getAcademyAll() {
    try {
      const academys = await this.academyRepository.find();

      const userAcademys = await Promise.all(
        academys.map(async (item) => {
          const userCount = await this.userRepository
            .createQueryBuilder('usr')
            .where('usr.academy_id = :academy_id', {
              academy_id: Number(item.academy_id),
            })
            .getCount();

          return {
            ...item,
            userCount: userCount,
          };
        }),
      );
      return userAcademys;
    } catch (error) {
      this.logger.error(error);
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
      this.logger.error(error);
      throw new HttpException(error, 500);
    }
  }

  // 내 반 모두 불러오기
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
      this.logger.error(error);
      throw new HttpException(error, 500);
    }
  }

  // 특정 반 모두 불러오기
  async getClassId(id) {
    try {
      // const userInfo: Payload = await jwt(req.headers.authorization);

      const classes = await this.classRepository
        .createQueryBuilder('class')
        .where('class.academy_id = :academy_id', {
          academy_id: Number(id),
        })
        .getMany();

      const userCountClasses = await Promise.all(
        classes.map(async (item) => {
          const userCount = await this.userRepository
            .createQueryBuilder('usr')
            .where('usr.class_id = :class_id', { class_id: item.class_id })
            .getCount();

          return {
            ...item,
            userCount: userCount,
          };
        }),
      );
      return userCountClasses;
    } catch (error) {
      this.logger.error(error);
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
      this.logger.error(error);
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
      this.logger.error(error);
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
      this.logger.error(error);
      throw new HttpException(error, 500);
    }
  }

  // 특정 학원 정보 불러오기
  async getInfoById(id: string) {
    try {
      const academy = await this.academyRepository.findOneBy([
        {
          academy_id: Number(id),
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
      this.logger.error(error);
      throw new HttpException(error, 500);
    }
  }

  // 특정 학원 학생 불러오기
  async getStudentId(id: string) {
    try {
      const students = this.userRepository
        .createQueryBuilder('usr')
        .where('usr.academy_id = :academy_id', { academy_id: Number(id) })
        .leftJoinAndSelect('usr.class_id', 'class_id')
        .getMany();
      return students;
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error, 500);
    }
  }

  // 내 학원 학생 정보 모두 불러오기
  async getAllClassStudent(req: IncomingMessage) {
    const userInfoGen = async (_users: UserEntity[]) => {
      return await Promise.all(
        _users.map(async (user) => {
          const userQuizs = await this.userQuizRepository
            .createQueryBuilder('uq')
            .where('uq.user_id = :user_id', { user_id: Number(user.user_id) })
            .leftJoinAndSelect('uq.quiz_id', 'quiz_id')
            .getMany();

          const uqList = userQuizs.map((_uq) => {
            return _uq.disabled
              ? null
              : {
                  title: `${_uq.quiz_id.title}, ${_uq.best_solve}/${
                    _uq.quiz_id.available_counts
                  }, ${formatDate(_uq.recent_date, true)}`,
                  data: { ..._uq },
                };
          });

          return {
            title: user.name,
            data: { ...user },
            list: uqList,
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
        title: `반 배정안됨 / ${users.length}명`,
        data: null,
        list: await userInfoGen(users),
      });

      return list;
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error, 500);
    }
  }

  // 학생 퀴즈 기록 모두 불러오기 테이블
  async getAllClassStudentTable(id: string | 'null', req: IncomingMessage) {
    const now = new Date();
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - lastWeek.getDay() - 5);

    // - 학생 정보 및 퀴즈 로그 리스트 추출 함수
    const userInfoGen = async (_users: UserEntity[], _date: string) => {
      return await Promise.all(
        _users.map(async (user) => {
          const quizLogs = await this.quizLogRepository
            .createQueryBuilder('quizLog')
            .leftJoinAndSelect('quizLog.userQuiz_id', 'userQuiz_id')
            .leftJoinAndSelect('userQuiz_id.quiz_id', 'quiz_id')
            .where('quizLog.user_id = :user_id', {
              user_id: Number(user.user_id),
            })
            .andWhere(
              `quizLog.created_at BETWEEN (CURRENT_TIMESTAMP - interval '7 day') AND CURRENT_TIMESTAMP`,
            )
            .getMany();

          const quizLogData = await Promise.all(
            quizLogs.map(async (_quizLog) => {
              const probLogsCount = await this.probLogRepository
                .createQueryBuilder('pl')
                .where('pl.quizLog_id = :quizLog_id', {
                  quizLog_id: Number(_quizLog.quizLog_id),
                })
                .getCount();

              return {
                title: _quizLog.quiz_title,
                data: {
                  quizLog_id: _quizLog.quizLog_id,
                  date: _quizLog.created_at,
                  score: _quizLog.score,
                  probCount: probLogsCount,
                },
              };
            }),
          );

          return {
            title: user.name,
            data: {
              class_name: user.class_id?.name ?? '반 배정 안됨',
            },
            list: quizLogData
              .filter((_qld) => formatDate(_qld.data.date, false) === _date)
              .sort((a, b) => dateSort(b.data.date, a.data.date)),
          };
        }),
      );
    };

    //  - 퀴즈 로그 날짜 데이터 맵 추출 함수
    const getAcademyDateMap = async (_users: UserEntity[]) => {
      const _userDates = await Promise.all(
        _users.flatMap(async (_usr) => {
          const _quizLogs = await this.quizLogRepository
            .createQueryBuilder('ql')
            .where('ql.user_id = :user_id', { user_id: Number(_usr.user_id) })
            .getMany();

          const _qlDates = _quizLogs.map((_ql) => {
            return formatDate(_ql.created_at);
          });

          return [...new Set(_qlDates)];
        }),
      );

      return [...new Set(_userDates.flat())];
    };

    try {
      const userInfo: Payload = await jwt(req.headers.authorization);

      const users =
        id === 'null'
          ? await this.userRepository
              .createQueryBuilder('user')
              .where('user.academy_id = :academy_id', {
                academy_id: Number(userInfo.academy_id),
              })
              .leftJoinAndSelect('user.class_id', 'class_id')
              .getMany()
          : [
              await this.userRepository
                .createQueryBuilder('user')
                .where('user.user_id = :user_id', {
                  user_id: Number(id),
                })
                .leftJoinAndSelect('user.class_id', 'class_id')
                .getOne(),
            ];

      const quizDateMap = await getAcademyDateMap(users);

      const list = await Promise.all(
        quizDateMap.map(async (_qdm) => {
          return {
            title: _qdm,
            list: await userInfoGen(users, _qdm),
          };
        }),
      );

      return list.sort((a, b) => dateSort(a.title, b.title));
    } catch (error) {
      this.logger.error(error);
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
        .andWhere('quiz.disabled = :disabled', { disabled: false })
        .getMany();

      return quizs;
    } catch (error) {
      this.logger.error(error);
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
      this.logger.error(error);
      throw new HttpException(error, 500);
    }
  }
}
