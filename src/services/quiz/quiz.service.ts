/* eslint-disable prefer-const */
import * as XLSX from 'xlsx';
import { HttpException, Injectable } from '@nestjs/common';
import { Equal, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import jwt from 'jwt-decode';

import { QuizCreateDataType, QuizItemType, ProbItemType } from './quiz.types';

import { BookEntity } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';

import { WordEntity } from './entities/word.entity';
import { CreateWordDto } from './dto/create-word.dto';

import { AudioEntity } from '../audio/entities/audio.entity';
import { CreateAudioDto } from '../audio/dto/create-audio.dto';

import { QuizEntity } from './entities/quiz.entity';
import { CreateQuizDto } from './dto/create-quiz.dto';

import { ProbEntity } from './entities/prob.entity';
import { CreateProbDto } from './dto/create-prob.dto';

import { OptionEntity } from './entities/option.entity';
import { CreateOptionDto } from './dto/create-option.dto';

import { UserQuizEntity } from '../user/entities/userQuiz.entity';

import { AcademyEntity } from '../academy/entities/academy.entity';

import { IncomingMessage } from 'http';
import { shuffle, randomArr } from '../../utils';

import { SolvedProbEntity } from '../user/entities/solvedProb.entity';

@Injectable()
export class QuizsService {
  constructor(
    @InjectRepository(BookEntity)
    private readonly bookRepository: Repository<BookEntity>,

    @InjectRepository(WordEntity)
    private readonly wordRepository: Repository<WordEntity>,

    @InjectRepository(AudioEntity)
    private readonly audioRepository: Repository<AudioEntity>,

    @InjectRepository(QuizEntity)
    private readonly quizRepository: Repository<QuizEntity>,

    @InjectRepository(UserQuizEntity)
    private readonly userQuizRepository: Repository<UserQuizEntity>,

    @InjectRepository(ProbEntity)
    private readonly probRepository: Repository<ProbEntity>,

    @InjectRepository(SolvedProbEntity)
    private readonly solvedProbRepository: Repository<SolvedProbEntity>,

    @InjectRepository(OptionEntity)
    private readonly optionRepository: Repository<OptionEntity>,

    @InjectRepository(AcademyEntity)
    private readonly academyRepository: Repository<AcademyEntity>,
  ) {}

  // 책 생성
  async createBook(file: Express.Multer.File, body, req: IncomingMessage) {
    try {
      const userInfo: any = await jwt(req.headers.authorization);
      const academy = await this.academyRepository.findOneBy([
        {
          academy_id: Number(userInfo.academy_id),
        },
      ]);
      const createBookDto = new CreateBookDto();

      createBookDto.title = decodeURIComponent(body.name);
      createBookDto.academy_id = academy;
      const lastBook = await this.bookRepository.save(createBookDto);

      const workbook = XLSX.read(file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(sheet, {
        defval: null,
      });

      for (const row of rows) {
        const createWordDto = new CreateWordDto();
        const createAudioDto = new CreateAudioDto();
        const values = Object.keys(row).map((key) => row[key]);

        createWordDto.book_id = lastBook;
        createWordDto.word = values[0];
        createWordDto.diacritic = values[1];
        createWordDto.meaning = values[2];
        createWordDto.type = values[3];
        const lastWord = await this.wordRepository.save(createWordDto);

        createAudioDto.file_name = `${values[0]}`;
        createAudioDto.url = `/audios/${values[0]}.mp3`;
        createAudioDto.word_id = lastWord;
        const lastAudio = await this.audioRepository.save(createAudioDto);
      }

      // return rows;
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  // 책 모두 불러오기
  async getBookAll(req: IncomingMessage) {
    const userInfo: any = await jwt(req.headers.authorization);

    const books = await this.bookRepository
      .createQueryBuilder('book')
      .where('book.academy_id = :academy_id', {
        academy_id: Number(userInfo.academy_id),
      })
      .getMany();

    const bookList = await Promise.all(
      books.map(async (item) => {
        const wordsLength = await this.wordRepository
          .createQueryBuilder()
          .where('book_id = :idx', { idx: Number(item.book_id) })
          .getCount();

        return {
          idx: Number(item.book_id),
          title: item.title,
          subtitle: wordsLength,
        };
      }),
    );
    return bookList;
  }

  // 책 삭제하기
  async deleteBook(id) {
    const book = await this.bookRepository
      .createQueryBuilder('book')
      .where('book.book_id = :book_id', { book_id: Number(id) })
      .getOne();

    await book.remove();
    // console.log(`Removed ${book.title}`);
    return `Removed ${book.title}`;
  }

  // 책 검색하기
  async searchBook(str: string) {
    const books = await this.bookRepository.find();
    const srBooks = books.filter((item) => item.title.includes(str));
    return srBooks;
  }

  // 퀴즈 모두 불러오기
  async getQuizAll(req: IncomingMessage) {
    try {
      const userInfo: any = await jwt(req.headers.authorization);

      const quizs = await this.quizRepository
        .createQueryBuilder('quiz')
        .where('quiz.academy_id = :academy_id', {
          academy_id: Number(userInfo.academy_id),
        })
        .getMany();

      const quizList = await Promise.all(
        quizs.map((item) => {
          return {
            idx: Number(item.quiz_id),
            title: item.title,
            subtitle: item.max_words,
          };
        }),
      );

      return quizList;
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 500);
    }
  }

  // 퀴즈 생성
  async createQuiz(data: QuizCreateDataType, req: IncomingMessage) {
    try {
      const userInfo: any = await jwt(req.headers.authorization);
      const academy = await this.academyRepository.findOneBy([
        {
          academy_id: Number(userInfo.academy_id),
        },
      ]);
      const createQuizDto = new CreateQuizDto();

      // 퀴즈 생성
      createQuizDto.type = data.type;
      createQuizDto.title = data.title;
      createQuizDto.time = data.time;
      createQuizDto.max_words = data.scope[1] + 1 - data.scope[0];
      createQuizDto.academy_id = academy;
      createQuizDto.available_counts = data.word_count;
      createQuizDto.max_options = data.max_options;
      const lastQuiz = await this.quizRepository.save(createQuizDto);

      // 문항 생성 함수
      const saveOptionFunc = async (
        _prob: ProbEntity,
        _words: WordEntity[],
      ) => {
        const _randNumArr = randomArr(
          [],
          _words.length,
          _prob.quiz_id.max_options - 1,
        );

        const corrWord = await this.wordRepository.findOneBy([
          { word_id: Number(_prob.word_id.word_id) },
        ]);

        const createOptionDto = new CreateOptionDto();
        createOptionDto.prob_id = _prob;
        createOptionDto.word_id = corrWord;
        await this.optionRepository.save(createOptionDto);

        _randNumArr.forEach(async (a) => {
          const createOptionDto = new CreateOptionDto();
          createOptionDto.prob_id = _prob;
          createOptionDto.word_id = _words[a];
          await this.optionRepository.save(createOptionDto);
        });
      };

      // 문제 & 문항 생성 함수
      const saveProbOptionFunc = async (
        _word: WordEntity,
        _orgnWords: WordEntity[],
      ) => {
        const createProbDto = new CreateProbDto();
        createProbDto.quiz_id = lastQuiz;
        createProbDto.word_id = _word;
        const lastProb = await this.probRepository.save(createProbDto);
        await saveOptionFunc(lastProb, _orgnWords);
      };

      // 문제 & 문항 생성
      const words = await this.wordRepository
        .createQueryBuilder('book')
        .where('book.book_id = :book_id', { book_id: Number(data.book_id) })
        .getMany();

      words.forEach(async (_word, i) => {
        await saveProbOptionFunc(_word, words);
      });
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 500);
    }
  }

  // 퀴즈 삭제하기
  async deleteQuiz(id, req: IncomingMessage) {
    try {
      const quiz = await this.quizRepository
        .createQueryBuilder('quiz')
        .where('quiz.quiz_id = :quiz_id', { quiz_id: Number(id) })
        .getOne();
      await quiz.remove();
      return `Removed ${quiz.title} Quiz`;
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  // 내 퀴즈 모두 불러오기
  async getMyQuizAll(req: IncomingMessage) {
    try {
      const userInfo: any = await jwt(req.headers.authorization);

      const myQuizs = await this.userQuizRepository
        .createQueryBuilder('userQuiz')
        .where('userQuiz.user_id = :user_id', { user_id: userInfo.user_id })
        .leftJoinAndSelect('userQuiz.quiz_id', 'quiz_id')
        .getMany();

      const myQuizList: QuizItemType[] = await Promise.all(
        myQuizs.map(async (item) => {
          const prob = await this.probRepository
            .createQueryBuilder('prob')
            .where('prob.quiz_id = :quiz_id', {
              quiz_id: Number(item.quiz_id.quiz_id),
            })
            .getOne();

          if (!prob) {
            item.disabled = true;
            const updateUserQuiz = await this.userQuizRepository.update(
              Number(item.userQuiz_id),
              item,
            );
          }

          return {
            userQuiz_id: Number(item.userQuiz_id),
            quiz_id: Number(item.quiz_id.quiz_id),
            title: item.quiz_id.title,
            date: item.recent_date.toUTCString(),
            tryCount: item.try_count,
            solvedCount: item.best_solve,
            maxCount: item.quiz_id.available_counts,
            disabled: item.disabled,
          };
        }),
      );
      return myQuizList;
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 500);
    }
  }

  // 퀴즈 문제 모두 불러오기
  async getQuizProbAll(id, uqid, req: IncomingMessage) {
    const quiz = await this.quizRepository
      .createQueryBuilder('quiz')
      .where('quiz.quiz_id = :quiz_id', { quiz_id: id })
      .getOne();

    const probs = await this.probRepository
      .createQueryBuilder('prob')
      .where('prob.quiz_id = :quiz_id', { quiz_id: id })
      .leftJoinAndSelect('prob.word_id', 'word_id')
      .getMany();

    const solvedProb = await this.solvedProbRepository
      .createQueryBuilder('sp')
      .where('sp.userQuiz_id = :userQuiz_id', { userQuiz_id: Number(uqid) })
      .leftJoinAndSelect('sp.prob_id', 'prob_id')
      .getManyAndCount();

    const quizTypeMap = {
      IN_PREV: async () => {
        const shuffleProbs = shuffle(probs);
        return shuffleProbs.slice(0, quiz.available_counts);
      },
      EX_PREV: async () => {
        const spProbIdList = solvedProb[0].map((_sp) => _sp.prob_id.prob_id);
        const filterProbs = probs.filter(
          (prb) => !spProbIdList.includes(prb.prob_id),
        );
        const shuffleProbs = shuffle(filterProbs);
        return shuffleProbs.slice(0, quiz.available_counts);
      },
      STATIC: async () => {
        return probs.slice(0, quiz.available_counts);
      },
    };

    const makeProbs = await quizTypeMap[quiz.type]();

    const probList = await Promise.all(
      makeProbs.map(async (item) => {
        const options = await this.optionRepository
          .createQueryBuilder('option')
          .leftJoinAndSelect('option.word_id', 'word_id')
          .where('option.prob_id = :prob_id', { prob_id: item.prob_id })
          .getMany();

        const audio = await this.audioRepository
          .createQueryBuilder('audio')
          .where('audio.word_id = :word_id', { word_id: item.word_id.word_id })
          .getOne();

        const optionList = shuffle([
          options[0].word_id.meaning,
          options[1].word_id.meaning,
          options[2].word_id.meaning,
          options[3].word_id.meaning,
        ]);

        return {
          prob_id: item.prob_id,
          word: item.word_id.word,
          diacritic: item.word_id.diacritic,
          options: optionList,
          answer: optionList.indexOf(item.word_id.meaning),
          audio: audio.url,
        };
      }),
    );

    const shuffleProbList = shuffle(probList);

    return { limitTime: quiz.time, probList: shuffleProbList };
  }
}
