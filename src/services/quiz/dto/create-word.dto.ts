import { IsNotEmpty } from 'class-validator';

import { BookEntity } from '../entities/book.entity';
import { AudioEntity } from 'src/services/audio/entities/audio.entity';

export class CreateWordDto {
  @IsNotEmpty()
  book_id: BookEntity;

  @IsNotEmpty()
  word: string;

  @IsNotEmpty()
  diacritic: string;

  @IsNotEmpty()
  meaning: string;

  @IsNotEmpty()
  type: string;

  audio_id: AudioEntity | null;
}
