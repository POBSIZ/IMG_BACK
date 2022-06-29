import { IsNotEmpty } from 'class-validator';
import { ProbEntity } from '../entities/prob.entity';
import { WordEntity } from '../entities/word.entity';

export class CreateOptionDto {
  // 문제 ID
  @IsNotEmpty()
  prob_id: ProbEntity;

  // 단어 ID
  @IsNotEmpty()
  word_id: WordEntity;
}
