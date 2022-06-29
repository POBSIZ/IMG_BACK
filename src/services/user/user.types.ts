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

export interface UserQuizUpadteData {
  userQuiz_id: number | bigint;
  quiz_id: number | bigint;
  best_solve: number;
  answerList: AnswerListItem[];
}

// [
//   [
//     {
//       quizLog_id: '1',
//       userQuiz_id: '1',
//       date: '2022-06-28T11:02:12.877Z',
//       title: '교육부선정 10단어 A',
//       score: 3,
//       probCount: 10
//     },
//     {
//       quizLog_id: '2',
//       userQuiz_id: '1',
//       date: ;,
//       title: '교육부선정 10단어 A',
//       score: 4,
//       probCount: 10
//     }
//   ]
// ]
