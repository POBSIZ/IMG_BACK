import { QuizEntity } from 'src/services/quiz/entities/quiz.entity';
import { WordEntity } from 'src/services/quiz/entities/word.entity';
import { UserQuizEntity } from 'src/services/user/entities/userQuiz.entity';
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { VocaEntity } from './voca.entity';

@Entity('VocaQuiz')
export class VocaQuizEntity extends BaseEntity {
  // 단어장 퀴즈 ID
  @PrimaryGeneratedColumn({ type: 'bigint' })
  vocaQuiz_id: bigint | number;

  // 단어장 ID
  @ManyToOne((type) => VocaEntity, (voca) => voca.voca_id, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'voca_id' })
  voca_id: VocaEntity;

  // 퀴즈 ID
  @OneToOne((type) => QuizEntity, (quiz) => quiz.quiz_id, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'quiz_id' })
  quiz_id: QuizEntity;

  // 유저퀴즈 ID
  @OneToOne((type) => UserQuizEntity, (userQuiz) => userQuiz.userQuiz_id, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'userQuiz_id' })
  userQuiz_id: UserQuizEntity;

  // 생성일
  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;
}
