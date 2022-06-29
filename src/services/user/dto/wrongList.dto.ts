import { IsNotEmpty } from 'class-validator';

import { UserQuizEntity } from '../entities/userQuiz.entity';

export class CreateWrongListDto {
  // 유저퀴즈 ID
  @IsNotEmpty()
  userQuiz_id: UserQuizEntity;
}
