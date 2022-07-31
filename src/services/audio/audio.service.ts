import { HttpException, Injectable } from '@nestjs/common';
import { CreateAudioDto } from './dto/create-audio.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AudioEntity } from './entities/audio.entity';

import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { Response } from 'express';

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

  async getAudio(word: string, res: Response) {
    try {
      const client = new TextToSpeechClient();

      const [response] = await client.synthesizeSpeech({
        input: { text: word },
        voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
        audioConfig: { audioEncoding: 'MP3' },
      });

      res.end(response.audioContent);
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 500);
    }
  }
}
