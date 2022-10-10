import { IsNotEmpty } from 'class-validator';
import { OmitType, PartialType } from '@nestjs/mapped-types';
import { AcademyEntity } from 'src/services/academy/entities/academy.entity';

import { QuizEntity, QuizType } from '../entities/quiz.entity';

export class CreateQuizDto extends OmitType(QuizEntity, [
  'academy_id',
  'title',
  'time',
  'max_words',
  'available_counts',
]) {
  constructor() {
    super();
  }

  // 학원 ID
  @IsNotEmpty()
  academy_id: AcademyEntity;

  // 퀴즈 제목
  @IsNotEmpty()
  title: string;

  // 풀이시간
  @IsNotEmpty()
  time: number;

  // 문제 수
  @IsNotEmpty()
  max_words: number;

  // 사용 가능 개수
  @IsNotEmpty()
  available_counts: number;
}
