import { Injectable } from '@nestjs/common';
import { CreateAudioDto } from './dto/create-audio.dto';
import { UpdateAudioDto } from './dto/update-audio.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AudioEntity } from './entities/audio.entity';

@Injectable()
export class AudiosService {
  constructor(
    @InjectRepository(AudioEntity)
    private readonly audioRepository: Repository<AudioEntity>,
  ) {}

  async findAll() {
    const audios = await this.audioRepository.find();
    return audios;
  }
}
