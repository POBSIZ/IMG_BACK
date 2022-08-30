import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { IncomingMessage } from 'http';
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

  // 단어장 생성
  @Get('get/all')
  async getVocaAll(@Req() req: IncomingMessage) {
    return await this.vocaService.getVocaAll(req);
  }
}
