export interface QuizLogItemType {
  quizLog_id: string;
  userQuiz_id: string;
  date: Date;
  title: string;
  score: number;
  probCount: number;
}

export interface AnswerListItem {
  id: number;
  prob_id: string;
  answer: [number, string] | [];
  correctWordId: number;
  correctWord: string;
  options: string[];
  diacritic: string;
  audio: string;
}

export interface QuizResultType {
  title: string;
  id: string;
  list: AnswerListItem[];
  corrCount: number;
}

export interface UserQuizUpadteData {
  title: string;
  time: string;
  max_words: string;
  userQuiz_id: string;
  quiz_id: string;
  best_solve: number;
  answerList: AnswerListItem[];
}
