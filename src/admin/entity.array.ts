import { UserEntity } from 'src/services/user/entities/user.entity';
import { UserQuizEntity } from 'src/services/user/entities/userQuiz.entity';
import { WrongListEntity } from 'src/services/user/entities/wrongList.entity';
import { WrongEntity } from 'src/services/user/entities/wrong.entity';
import { QuizLogEntity } from 'src/services/user/entities/quizLog.entity';

import { AcademyEntity } from 'src/services/academy/entities/academy.entity';
import { ClassEntity } from 'src/services/academy/entities/class.entity';

import { QuizEntity } from 'src/services/quiz/entities/quiz.entity';
import { BookEntity } from 'src/services/quiz/entities/book.entity';
import { ProbEntity } from 'src/services/quiz/entities/prob.entity';
import { OptionEntity } from 'src/services/quiz/entities/option.entity';
import { WordEntity } from 'src/services/quiz/entities/word.entity';

import { AudioEntity } from 'src/services/audio/entities/audio.entity';

import { BoardEntity } from 'src/services/board/entities/board.entity';
import { PostEntity } from 'src/services/board/entities/post.entity';
import { CommentEntity } from 'src/services/board/entities/comment.entity';
import { ReplyEntity } from 'src/services/board/entities/reply.entity';

const EntityArr = [
  { resource: UserEntity, options: { parent: { name: '회원' } } },
  { resource: UserQuizEntity, options: { parent: { name: '회원퀴즈' } } },
  { resource: WrongListEntity, options: { parent: { name: '회원퀴즈' } } },
  { resource: WrongEntity, options: { parent: { name: '회원퀴즈' } } },
  { resource: QuizLogEntity, options: { parent: { name: '회원퀴즈' } } },

  { resource: AcademyEntity, options: { parent: { name: '학원' } } },
  { resource: ClassEntity, options: { parent: { name: '학원' } } },

  { resource: BookEntity, options: { parent: { name: '퀴즈' } } },
  { resource: QuizEntity, options: { parent: { name: '퀴즈' } } },
  { resource: ProbEntity, options: { parent: { name: '퀴즈' } } },
  { resource: OptionEntity, options: { parent: { name: '퀴즈' } } },
  { resource: WordEntity, options: { parent: { name: '퀴즈' } } },

  { resource: AudioEntity, options: { parent: { name: '음성' } } },

  { resource: BoardEntity, options: { parent: { name: '게시판' } } },
  { resource: PostEntity, options: { parent: { name: '게시판' } } },
  { resource: CommentEntity, options: { parent: { name: '게시판' } } },
  { resource: ReplyEntity, options: { parent: { name: '게시판' } } },
];
export default EntityArr;
