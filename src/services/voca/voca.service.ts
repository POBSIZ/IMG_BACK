import { HttpException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Response } from 'express';

import jwt from 'jwt-decode';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { dateSort, shuffle } from 'src/utils';

import { WordEntity } from '../quiz/entities/word.entity';
import { VocaEntity } from './entities/voca.entity';
import { VocaWordEntity } from './entities/vocaWord.entity';

import { getWordListDataType } from './types/getWordList';

import { getTranslate } from 'src/api';
import { createVocaBodyType } from './types/createVoca';
import { CreateVocaDto } from './dto/voca.dto';
import { IncomingMessage } from 'http';
import { Payload } from '../user/jwt/jwt.payload';
import { UserEntity } from '../user/entities/user.entity';
import { CreateWordDto } from '../quiz/dto/create-word.dto';
import { CreateVocaWordDto } from './dto/vocaWord.dto';
import { AddWordsBodyType } from './types/addWords';
import { CreateQuizDto } from '../quiz/dto/create-quiz.dto';
import { QuizEntity, QuizType } from '../quiz/entities/quiz.entity';
import { CreateOptionDto } from '../quiz/dto/create-option.dto';
import { ProbEntity } from '../quiz/entities/prob.entity';
import { CreateProbDto } from '../quiz/dto/create-prob.dto';
import { OptionEntity } from '../quiz/entities/option.entity';
import { CreateUserQuizDto } from '../user/dto/userQuiz.dto';
import { UserQuizEntity } from '../user/entities/userQuiz.entity';
import { CreateVocaQuizDto } from './dto/vocaQuiz.dto';
import { VocaQuizEntity } from './entities/vocaQuiz.entity';

@Injectable()
export class VocaService {
  private logger = new Logger('VocaService');

  constructor(
    @InjectRepository(WordEntity)
    private readonly wordRepository: Repository<WordEntity>,

    @InjectRepository(VocaEntity)
    private readonly vocaRepository: Repository<VocaEntity>,

    @InjectRepository(VocaWordEntity)
    private readonly vocaWordRepository: Repository<VocaWordEntity>,

    @InjectRepository(VocaQuizEntity)
    private readonly vocaQuizRepository: Repository<VocaQuizEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(QuizEntity)
    private readonly quizRepository: Repository<QuizEntity>,

    @InjectRepository(ProbEntity)
    private readonly probRepository: Repository<ProbEntity>,

    @InjectRepository(OptionEntity)
    private readonly optionRepository: Repository<OptionEntity>,

    @InjectRepository(UserQuizEntity)
    private readonly userQuizRepository: Repository<UserQuizEntity>,
  ) {}

  // 단어 뜻 찾기
  async getWordList(data: getWordListDataType) {
    try {
      const wl = await Promise.all(
        data.labels.flatMap(async (lb) => {
          const currList = data.word_list.filter((wl) => wl[1] === lb[1]);
          return await Promise.all(
            currList.flatMap(async (cl) => {
              try {
                const wordPhonetic = await axios.get(
                  `https://api.dictionaryapi.dev/api/v2/entries/en/${cl[0]}`,
                );
                const meaning = await getTranslate(cl[0]);

                return {
                  word: wordPhonetic.data[0].word,
                  phonetic: wordPhonetic.data[0].phonetic?.replace(
                    /[\/\[\]]/gi,
                    '',
                  ),
                  meaning: meaning,
                  label: lb,
                };
              } catch (error) {
                const meaning = await getTranslate(cl[0]);
                return {
                  word: cl[0],
                  phonetic: '',
                  meaning: meaning,
                  label: lb,
                };
              }
            }),
          );
        }),
      );

      return wl.flat().sort((a, b) => a.label[1] - b.label[1]);
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error, 500);
    }
  }

  // 단어장 생성
  async createVoca(data: createVocaBodyType, req: IncomingMessage) {
    try {
      const userInfo: Payload = await jwt(req.headers.authorization);

      const user = await this.userRepository
        .createQueryBuilder('usr')
        .where('usr.user_id = :user_id', { user_id: Number(userInfo.user_id) })
        .getOne();

      const createVocaDto = new CreateVocaDto();
      createVocaDto.user_id = user;
      createVocaDto.name = data.name;
      createVocaDto.origin = data.origin;
      const voca = await this.vocaRepository.save(createVocaDto);

      data.word_list.forEach(async (_wrd) => {
        const word = await this.wordRepository
          .createQueryBuilder('wd')
          .where('wd.word = :word', { word: _wrd.word })
          .getOne();

        const vocaWord = this.vocaWordRepository
          .createQueryBuilder('vw')
          .where('vw.word_id = :word_id', { word_id: word.word_id })
          .andWhere('vw.is_out = :is_out', { is_out: false })
          .getOne();

        if (vocaWord === null) {
          const createWordDto = new CreateWordDto();
          createWordDto.word = _wrd.word;
          createWordDto.diacritic = _wrd.phonetic ?? '';
          createWordDto.meaning = _wrd.meaning;
          createWordDto.type = '';
          const saveWord = await this.wordRepository.save(createWordDto);

          const createVocaWordDto = new CreateVocaWordDto();
          createVocaWordDto.word_id = saveWord;
          createVocaWordDto.voca_id = voca;
          createVocaWordDto.label = Number(_wrd.label[0]);
          const saveVocaWord = await this.vocaWordRepository.save(
            createVocaWordDto,
          );
        } else {
          const createVocaWordDto = new CreateVocaWordDto();
          createVocaWordDto.word_id = word;
          createVocaWordDto.voca_id = voca;
          createVocaWordDto.label = Number(_wrd.label[0]);
          const saveVocaWord = await this.vocaWordRepository.save(
            createVocaWordDto,
          );
        }
      });

      return 'success';
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error, 500);
    }
  }

  // 단어장 단어 추가 생성
  async addWords(data: AddWordsBodyType, req: IncomingMessage) {
    try {
      const voca = await this.vocaRepository
        .createQueryBuilder('vc')
        .where('vc.voca_id = :voca_id', { voca_id: Number(data.voca_id) })
        .getOne();

      data.word_list.forEach(async (_wrd) => {
        const word = await this.wordRepository
          .createQueryBuilder('wd')
          .where('wd.word = :word', { word: _wrd.word })
          .getOne();

        if (word === null) {
          const createWordDto = new CreateWordDto();
          createWordDto.word = _wrd.word;
          createWordDto.diacritic = _wrd.phonetic ?? '';
          createWordDto.meaning = _wrd.meaning;
          createWordDto.type = '';
          const saveWord = await this.wordRepository.save(createWordDto);

          const createVocaWordDto = new CreateVocaWordDto();
          createVocaWordDto.word_id = saveWord;
          createVocaWordDto.voca_id = voca;
          createVocaWordDto.label = Number(_wrd.label[0]);
          createVocaWordDto.is_out = true;
          const saveVocaWord = await this.vocaWordRepository.save(
            createVocaWordDto,
          );
        } else {
          const createVocaWordDto = new CreateVocaWordDto();
          createVocaWordDto.word_id = word;
          createVocaWordDto.voca_id = voca;
          createVocaWordDto.label = Number(_wrd.label[0]);
          createVocaWordDto.is_out = false;
          const saveVocaWord = await this.vocaWordRepository.save(
            createVocaWordDto,
          );
        }
      });

      return 'success';
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error, 500);
    }
  }

  // 단어장 퀴즈 생성
  async createQuiz(id: string, req: IncomingMessage) {
    try {
      const userInfo: Payload = await jwt(req.headers.authorization);

      const voca = await this.vocaRepository
        .createQueryBuilder('vc')
        .where('vc.voca_id = :voca_id', { voca_id: Number(id) })
        .getOne();

      const vocaWords = await this.vocaWordRepository
        .createQueryBuilder('vw')
        .where('vw.voca_id = :voca_id', { voca_id: Number(id) })
        .leftJoinAndSelect('vw.word_id', 'word_id')
        .getManyAndCount();

      // 퀴즈 생성
      const createQuizDto = new CreateQuizDto();
      createQuizDto.type =
        vocaWords[1] >= 30 ? QuizType.EX_PREV : QuizType.IN_PREV;
      createQuizDto.title = voca.name;
      createQuizDto.time = 10;
      createQuizDto.max_words = vocaWords[1];
      createQuizDto.academy_id = null;
      createQuizDto.available_counts = vocaWords[1] >= 30 ? 30 : vocaWords[1];
      createQuizDto.max_options = 4;
      createQuizDto.is_voca = true;
      const saveQuiz = await this.quizRepository.save(createQuizDto);

      // 문항 생성 함수
      const saveOptionFunc = async (
        _prob: ProbEntity,
        _words: WordEntity[],
      ) => {
        const _randNumArr: number[] = shuffle(
          [...Array(_words.length)].map((_, i) => i),
        ).slice(0, 4 - 1);

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
        _lastQuiz: typeof saveQuiz,
      ) => {
        const createProbDto = new CreateProbDto();
        createProbDto.quiz_id = _lastQuiz;
        createProbDto.word_id = _word;
        const lastProb = await this.probRepository.save(createProbDto);
        await saveOptionFunc(lastProb, _orgnWords);
      };

      // 문제 & 문항 생성
      const words = vocaWords[0].map((vw) => vw.word_id);

      words.forEach(async (_word, i) => {
        await saveProbOptionFunc(_word, words, saveQuiz);
      });

      // 유저퀴즈 생성
      const createUserQuizDto = new CreateUserQuizDto();

      const user = await this.userRepository.findOneBy([
        {
          user_id: Number(userInfo.user_id),
        },
      ]);

      createUserQuizDto.user_id = user;
      createUserQuizDto.quiz_id = saveQuiz;
      createUserQuizDto.is_voca = true;

      const saveUserQuiz = await this.userQuizRepository.save(
        createUserQuizDto,
      );

      const createVocaQuizDto = new CreateVocaQuizDto();
      createVocaQuizDto.voca_id = voca;
      createVocaQuizDto.quiz_id = saveQuiz;
      createVocaQuizDto.userQuiz_id = saveUserQuiz;

      await this.vocaQuizRepository.save(createVocaQuizDto);

      return 'success';
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error, 500);
    }
  }

  // 단어 퀴즈 삭제
  async removeQuiz(id: string, req: IncomingMessage) {
    try {
      const userInfo: Payload = await jwt(req.headers.authorization);
      const vocaQuiz = await this.vocaQuizRepository
        .createQueryBuilder('vq')
        .where('vq.voca_id = :voca_id', { voca_id: Number(id) })
        .leftJoinAndSelect('vq.userQuiz_id', 'userQuiz_id')
        .andWhere('userQuiz_id.disabled = :disabled', { disabled: false })
        .getOne();

      if (vocaQuiz) {
        vocaQuiz.userQuiz_id.disabled = true;
        await this.userQuizRepository.update(
          Number(vocaQuiz.userQuiz_id.userQuiz_id),
          vocaQuiz.userQuiz_id,
        );
      }
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error, 500);
    }
  }

  // 단어장 모두 불러오기
  async getVocaAll(req: IncomingMessage) {
    try {
      const userInfo: Payload = await jwt(req.headers.authorization);

      const vocas = await this.vocaRepository
        .createQueryBuilder('vc')
        .where('vc.user_id = :user_id', { user_id: Number(userInfo.user_id) })
        .getMany();

      return vocas.sort((a, b) => dateSort(a.created_at, b.created_at));
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error, 500);
    }
  }

  // 단어장 단어 모두 불러오기
  async getVocaWords(id: string, req: IncomingMessage) {
    try {
      const userInfo: Payload = await jwt(req.headers.authorization);

      const voca = await this.vocaRepository
        .createQueryBuilder('vc')
        .where('vc.voca_id = :voca_id', { voca_id: Number(id) })
        .getOne();

      const vocaWords = await this.vocaWordRepository
        .createQueryBuilder('vw')
        .where('vw.voca_id = :voca_id', { voca_id: Number(id) })
        .leftJoinAndSelect('vw.word_id', 'word_id')
        .getMany();

      const vocaQuizCount = await this.vocaQuizRepository
        .createQueryBuilder('vq')
        .where('vq.voca_id = :voca_id', { voca_id: Number(id) })
        .leftJoinAndSelect('vq.userQuiz_id', 'userQuiz_id')
        .andWhere('userQuiz_id.disabled = :disabled', { disabled: false })
        .getCount();

      const data = {
        name: voca.name,
        origin: voca.origin,
        created_at: voca.created_at,
        voca_id: voca.voca_id,
        word_list: vocaWords.sort((a, b) => a.label - b.label),
        has_quiz: vocaQuizCount > 0,
      };

      return data;
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error, 500);
    }
  }

  // 단어장 단어 모두 불러오기
  async getWordsByExcel(id: string, req: IncomingMessage, res: Response) {
    try {
      // const userInfo: Payload = await jwt(req.headers.authorization);

      // const voca = await this.vocaRepository
      //   .createQueryBuilder('vc')
      //   .where('vc.voca_id = :voca_id', { voca_id: Number(id) })
      //   .getOne();

      const vocaWords = await this.vocaWordRepository
        .createQueryBuilder('vw')
        .where('vw.voca_id = :voca_id', { voca_id: Number(id) })
        .leftJoinAndSelect('vw.word_id', 'word_id')
        .getMany();

      const wordList = await Promise.all(
        vocaWords.map(async (item) => {
          return {
            단어: item.word_id.word,
            발음: item.word_id.diacritic,
            주요뜻: item.word_id.meaning,
            메모: item.word_id.type,
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
      this.logger.error(error);
      throw new HttpException(error, 500);
    }
  }

  // 단어 제거
  async removeWord(id: string, req: IncomingMessage) {
    try {
      await (
        await this.vocaWordRepository
          .createQueryBuilder('vw')
          .where('vw.vocaWord_id = :vocaWord_id', { vocaWord_id: Number(id) })
          .getOne()
      ).remove();

      return 'success';
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error, 500);
    }
  }

  // 단어장 합치기
  async mergeVoca(data: string[], req: IncomingMessage) {
    try {
      const userInfo: Payload = await jwt(req.headers.authorization);

      const user = await this.userRepository
        .createQueryBuilder('usr')
        .where('usr.user_id = :user_id', { user_id: Number(userInfo.user_id) })
        .getOne();

      const vocaList = await Promise.all(
        data.map(async (_vocaId) => {
          return await this.vocaRepository
            .createQueryBuilder('vc')
            .where('vc.voca_id = :voca_id', { voca_id: Number(_vocaId) })
            .getOne();
        }),
      );

      const createVocaDto = new CreateVocaDto();
      createVocaDto.user_id = user;
      createVocaDto.name = vocaList.map((vc) => vc.name).join(', ');
      createVocaDto.origin = '';
      const voca = await this.vocaRepository.save(createVocaDto);

      data.forEach(async (_vocaId) => {
        const vocaWords = await this.vocaWordRepository
          .createQueryBuilder('vw')
          .where('vw.voca_id = :voca_id', { voca_id: Number(_vocaId) })
          .leftJoinAndSelect('vw.word_id', 'word_id')
          .getMany();

        await Promise.all(
          vocaWords.map(async (vw) => {
            const createVocaWordDto = new CreateVocaWordDto();
            createVocaWordDto.word_id = vw.word_id;
            createVocaWordDto.voca_id = voca;
            createVocaWordDto.label = vw.label;
            const saveVocaWord = await this.vocaWordRepository.save(
              createVocaWordDto,
            );
          }),
        );
      });

      return 'success';
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error, 500);
    }
  }
}
