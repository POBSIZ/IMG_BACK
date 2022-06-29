import { IsNotEmpty } from 'class-validator';

export class CreateQuizDto {
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
