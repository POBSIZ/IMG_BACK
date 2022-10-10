import { QuizType } from './entities/quiz.entity';

export interface BookWordListType {
  idx: number;
  title: string;
  subtitle: number | string;
  scope: [number, number];
  word_count: number;
  type: 'IN_PREV' | 'EX_PREV' | 'STATIC';
}

export interface QuizCreateDataType {
  title: string;
  time: number;
  // wordList: BookWordListType[];
  book_id: number;
  scope: [number, number];
  word_count: number;
  type: QuizType;
  max_options?: number;
}

export interface ProbItemType {
  word: string;
  diacritic: string;
  options: string[];
  answer: number;
  audio: string;
}

export interface QuizItemType {
  userQuiz_id: string;
  quiz_id: string;
  title: string;
  date: string;
  tryCount: number;
  solvedCount: number;
  maxCount: number;
  disabled: boolean;
  is_voca: boolean;
  voca_id: string;
}
