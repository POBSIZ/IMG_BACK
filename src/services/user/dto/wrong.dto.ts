import { IsNotEmpty } from 'class-validator';

import { WrongListEntity } from '../entities/wrongList.entity';
import { ProbEntity } from 'src/services/quiz/entities/prob.entity';

export class CreateWrongDto {
  // 오답목록 ID
  @IsNotEmpty()
  wrongList_id: WrongListEntity;

  // 문제 ID
  @IsNotEmpty()
  prob_id: ProbEntity;

  // 오답 단어
  @IsNotEmpty()
  wrong_word: string;
}
