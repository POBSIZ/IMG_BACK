import { ProbEntity } from 'src/services/quiz/entities/prob.entity';
import { UserQuizEntity } from '../entities/userQuiz.entity';
import { IsNotEmpty } from 'class-validator';

export class CreateSolvedProbDto {
  // 유저퀴즈 ID
  @IsNotEmpty()
  userQuiz_id: UserQuizEntity;

  // 문제 ID
  @IsNotEmpty()
  prob_id: ProbEntity;
}
