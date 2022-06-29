import { IsNotEmpty } from 'class-validator';
import { QuizEntity } from '../entities/quiz.entity';
import { WordEntity } from '../entities/word.entity';

export class CreateProbDto {
  // 퀴즈 ID
  @IsNotEmpty()
  quiz_id: QuizEntity;

  // 단어 ID
  @IsNotEmpty()
  word_id: WordEntity;
}
