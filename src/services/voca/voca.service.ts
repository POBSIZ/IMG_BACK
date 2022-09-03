import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Response } from 'express';

import jwt from 'jwt-decode';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { dateSort } from 'src/utils';

import { WordEntity } from '../quiz/entities/word.entity';
import { VocaEntity } from './entities/voca.entity';
import { VocaWordEntity } from './entities/vocaWord.entity';

import { getWordListDataType } from './types/getWordList';

import { setTranslate } from 'src/api';
import { createVocaBodyType } from './types/createVoca';
import { CreateVocaDto } from './dto/voca.dto';
import { IncomingMessage } from 'http';
import { Payload } from '../user/jwt/jwt.payload';
import { UserEntity } from '../user/entities/user.entity';
import { CreateWordDto } from '../quiz/dto/create-word.dto';
import { CreateVocaWordDto } from './dto/vocaWord.dto';
import { AddWordsBodyType } from './types/addWords';

@Injectable()
export class VocaService {
  constructor(
    @InjectRepository(WordEntity)
    private readonly wordRepository: Repository<WordEntity>,

    @InjectRepository(VocaEntity)
    private readonly vocaRepository: Repository<VocaEntity>,

    @InjectRepository(VocaWordEntity)
    private readonly vocaWordRepository: Repository<VocaWordEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  // 단어 뜻 찾기
  async getWordList(data: getWordListDataType) {
    try {
      const translate = setTranslate();

      const wl = await Promise.all(
        data.labels.flatMap(async (lb) => {
          const currList = data.word_list.filter((wl) => wl[1] === lb[1]);
          return await Promise.all(
            currList.flatMap(async (cl) => {
              try {
                const wordPhonetic = await axios.get(
                  `https://api.dictionaryapi.dev/api/v2/entries/en/${cl[0]}`,
                );
                const meaning = await translate(cl[0]);

                return {
                  word: wordPhonetic.data[0].word,
                  phonetic: wordPhonetic.data[0].phonetic?.replace(
                    /[\/\[\]]/gi,
                    '',
                  ),
                  meaning: meaning[0],
                  label: lb,
                };
              } catch (error) {
                const meaning = await translate(cl[0]);
                return {
                  word: cl[0],
                  phonetic: '',
                  meaning: meaning[0],
                  label: lb,
                };
              }
            }),
          );
        }),
      );

      return wl.flat().sort((a, b) => a.label[1] - b.label[1]);
    } catch (error) {
      console.log(error);
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

      const data = {
        name: voca.name,
        origin: voca.origin,
        created_at: voca.created_at,
        voca_id: voca.voca_id,
        word_list: vocaWords.sort((a, b) => a.label - b.label),
      };

      return data;
    } catch (error) {
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
      console.log(error);
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
      throw new HttpException(error, 500);
    }
  }
}
