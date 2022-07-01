import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty } from 'class-validator';

import { UserEntity } from '../entities/user.entity';
import { QuizEntity } from 'src/services/quiz/entities/quiz.entity';

export class CreateUserQuizDto {
  // 회원 ID
  @IsNotEmpty()
  user_id: UserEntity;

  // 퀴즈 ID
  @IsNotEmpty()
  quiz_id: QuizEntity;

  // 시도횟수
  @IsNotEmpty()
  try_count: number;

  // 최고성적
  @IsNotEmpty()
  best_solve: number;
}

export class UpdateUserQuizDto extends PartialType(CreateUserQuizDto) {
  // 퀴즈 ID
  quiz_id: QuizEntity;

  // 시도횟수
  try_count: number;

  // 최고성적
  best_solve: number;

  // 최고성적
  disabled: boolean;
}
