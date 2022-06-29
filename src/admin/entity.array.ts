import { UserEntity } from 'src/services/user/entities/user.entity';
import { UserQuizEntity } from 'src/services/user/entities/userQuiz.entity';
import { WrongListEntity } from 'src/services/user/entities/wrongList.entity';
import { WrongEntity } from 'src/services/user/entities/wrong.entity';
import { QuizLogEntity } from 'src/services/user/entities/quizLog.entity';

import { QuizEntity } from 'src/services/quiz/entities/quiz.entity';
import { BookEntity } from 'src/services/quiz/entities/book.entity';
import { ProbEntity } from 'src/services/quiz/entities/prob.entity';
import { OptionEntity } from 'src/services/quiz/entities/option.entity';
import { WordEntity } from 'src/services/quiz/entities/word.entity';

import { AudioEntity } from 'src/services/audio/entities/audio.entity';

const EntityArr = [
  { resource: UserEntity, options: { parent: { name: '회원' } } },
  { resource: UserQuizEntity, options: { parent: { name: '회원퀴즈' } } },
  { resource: WrongListEntity, options: { parent: { name: '회원퀴즈 오답' } } },
  { resource: WrongEntity, options: { parent: { name: '회원퀴즈 오답' } } },
  { resource: QuizLogEntity, options: { parent: { name: '회원퀴즈 로그' } } },
  { resource: BookEntity, options: { parent: { name: '책' } } },
  { resource: QuizEntity, options: { parent: { name: '퀴즈' } } },
  { resource: ProbEntity, options: { parent: { name: '퀴즈' } } },
  { resource: OptionEntity, options: { parent: { name: '퀴즈' } } },
  { resource: WordEntity, options: { parent: { name: '퀴즈' } } },
  { resource: AudioEntity, options: { parent: { name: '음성' } } },
];
export default EntityArr;
