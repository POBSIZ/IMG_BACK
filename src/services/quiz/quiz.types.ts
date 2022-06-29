export interface BookWordListType {
  idx: number;
  title: string;
  subtitle: number | string;
  isRandom: boolean;
  isScope: boolean;
  amount: number | string;
  scope: [number, number];
}

export interface QuizCreateDataType {
  title: string;
  time: number;
  wordList: BookWordListType[];
}

export interface ProbItemType {
  word: string;
  diacritic: string;
  options: string[];
  answer: number;
  audio: string;
}

export interface QuizItemType {
  userQuiz_id: number;
  quiz_id: number;
  title: string;
  date: string;
  tryCount: number;
  solvedCount: number;
  maxCount: number;
  disabled: boolean;
}
