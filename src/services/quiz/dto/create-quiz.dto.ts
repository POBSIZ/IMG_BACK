import { IsNotEmpty } from 'class-validator';
import { AcademyEntity } from 'src/services/academy/entities/academy.entity';

export class CreateQuizDto {
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
}
