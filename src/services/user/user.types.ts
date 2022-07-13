export interface QuizLogItemType {
  quizLog_id: number | bigint;
  userQuiz_id: number | bigint;
  date: Date;
  title: string;
  score: number;
  probCount: number;
}

export interface AnswerListItem {
  id: number;
  prob_id: number;
  answer: [number, string] | [];
  correctWordId: number;
  correctWord: string;
  options: string[];
  diacritic: string;
  audio: string;
}

export interface QuizResultType {
  title: string;
  id: number;
  list: AnswerListItem[];
  corrCount: number;
}

export interface UserQuizUpadteData {
  userQuiz_id: number | bigint;
  quiz_id: number | bigint;
  best_solve: number;
  answerList: AnswerListItem[];
}
