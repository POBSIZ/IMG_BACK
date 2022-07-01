import { IsNotEmpty } from 'class-validator';
import { WordEntity } from 'src/services/quiz/entities/word.entity';

export class CreateAudioDto {
  @IsNotEmpty()
  word_id: WordEntity;

  @IsNotEmpty()
  file_name: string;

  @IsNotEmpty()
  url: string;
}
