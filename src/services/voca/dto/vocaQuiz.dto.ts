import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty } from 'class-validator';

import { VocaEntity } from '../entities/voca.entity';
import { WordEntity } from 'src/services/quiz/entities/word.entity';
import { VocaQuizEntity } from '../entities/vocaQuiz.entity';

export class CreateVocaQuizDto extends PartialType(VocaQuizEntity) {}

export class UpdateVocaWordDto extends PartialType(CreateVocaQuizDto) {}
