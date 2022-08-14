import { IsNotEmpty } from 'class-validator';
import { UserEntity } from '../entities/user.entity';

import { UserQuizEntity } from '../entities/userQuiz.entity';
import { WrongListEntity } from '../entities/wrongList.entity';

export class CreateQuizLogDto {
  // 유저 ID
  @IsNotEmpty()
  user_id: UserEntity;

  // 유저퀴즈 ID
  @IsNotEmpty()
  userQuiz_id: UserQuizEntity;

  // 오답목록 ID
  @IsNotEmpty()
  wrongList_id: WrongListEntity;

  // 퀴즈 제목
  @IsNotEmpty()
  quiz_title: string;

  // 점수
  @IsNotEmpty()
  score: number;

  // 문항수
  @IsNotEmpty()
  max_words: number;

  // 풀이시간
  @IsNotEmpty()
  time: number;
}
