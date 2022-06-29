import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AudiosService } from './audio.service';
import { CreateAudioDto } from './dto/create-audio.dto';
import { UpdateAudioDto } from './dto/update-audio.dto';

@Controller('audio')
export class AudiosController {
  constructor(private readonly audiosService: AudiosService) {}

  @Get()
  findAll() {
    return this.audiosService.findAll();
  }
}
