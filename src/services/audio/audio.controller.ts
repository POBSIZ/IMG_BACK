import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { AudiosService } from './audio.service';
import { CreateAudioDto } from './dto/create-audio.dto';

@Controller('audio')
export class AudiosController {
  constructor(private readonly audiosService: AudiosService) {}

  @Get()
  findAll() {
    return this.audiosService.findAll();
  }

  @Get('get/:word')
  async getAudio(@Param('word') word, @Res() res) {
    return await this.audiosService.getAudio(word, res);
  }
}
