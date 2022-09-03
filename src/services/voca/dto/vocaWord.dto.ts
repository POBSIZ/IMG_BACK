import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty } from 'class-validator';

import { VocaEntity } from '../entities/voca.entity';
import { WordEntity } from 'src/services/quiz/entities/word.entity';

export class CreateVocaWordDto {
  @IsNotEmpty()
  voca_id: VocaEntity;

  @IsNotEmpty()
  word_id: WordEntity;

  @IsNotEmpty()
  label: number;

  is_out: boolean;
}

export class UpdateVocaWordDto extends PartialType(CreateVocaWordDto) {}
