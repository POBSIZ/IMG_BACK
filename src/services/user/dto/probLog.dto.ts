import { IsNotEmpty } from 'class-validator';
import { ProbEntity } from 'src/services/quiz/entities/prob.entity';
import { QuizLogEntity } from '../entities/quizLog.entity';

export class CreateProbLogDto {
  // 퀴즈 로그 ID
  @IsNotEmpty()
  quizLog_id: QuizLogEntity;

  // 문제 ID
  @IsNotEmpty()
  prob_id: ProbEntity;
}
