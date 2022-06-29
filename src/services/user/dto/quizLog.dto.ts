import { IsNotEmpty } from 'class-validator';

import { UserQuizEntity } from '../entities/userQuiz.entity';
import { WrongListEntity } from '../entities/wrongList.entity';

export class CreateQuizLogDto {
  // 유저퀴즈 ID
  @IsNotEmpty()
  userQuiz_id: UserQuizEntity;

  // 오답목록 ID
  @IsNotEmpty()
  wrongList_id: WrongListEntity;

  // 점수
  @IsNotEmpty()
  score: number;
}
