import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Header,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { IncomingMessage } from 'http';
import { AddWordsBodyType } from './types/addWords';
import { createVocaBodyType } from './types/createVoca';
import { getWordListDataType } from './types/getWordList';
import { VocaService } from './voca.service';

@Controller('voca')
export class VocaController {
  constructor(private readonly vocaService: VocaService) {}

  // 단어 뜻 찾기
  @Post('words')
  async getWordList(@Body() data: getWordListDataType) {
    return await this.vocaService.getWordList(data);
  }

  // 단어장 생성
  @Post('create')
  async createVoca(
    @Body() data: createVocaBodyType,
    @Req() req: IncomingMessage,
  ) {
    return await this.vocaService.createVoca(data, req);
  }

  // 단어장 단어 추가 생성
  @Post('add/words')
  async addWords(@Body() data: AddWordsBodyType, @Req() req: IncomingMessage) {
    return await this.vocaService.addWords(data, req);
  }

  // 단어장 생성
  @Get('get/all')
  async getVocaAll(@Req() req: IncomingMessage) {
    return await this.vocaService.getVocaAll(req);
  }

  // 단어장 단어 목록 불러오기
  @Get('get/words/:id')
  async getVocaWords(@Param('id') id, @Req() req: IncomingMessage) {
    return await this.vocaService.getVocaWords(id, req);
  }

  // 단어장 엑셀 불러오기
  @Get('get/words/excel/:id')
  @Header(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  )
  @Header('Content-Disposition', 'attachment; filename=voca.xlsx')
  async getWordsByExcel(
    @Param('id') id: string,
    @Req() req: IncomingMessage,
    @Res() res: Response,
  ) {
    return await this.vocaService.getWordsByExcel(id, req, res);
  }

  // 단어 제거
  @Delete('remove/word/:id')
  async removeWord(@Param('id') id: string, @Req() req: IncomingMessage) {
    return await this.vocaService.removeWord(id, req);
  }
}
