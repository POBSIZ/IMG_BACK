import {
  Column,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  BaseEntity,
} from 'typeorm';

import { QuizEntity } from './quiz.entity';
import { WordEntity } from './word.entity';

@Entity('Prob')
export class ProbEntity extends BaseEntity {
  // 문제 ID
  @PrimaryGeneratedColumn({ type: 'bigint' })
  prob_id: bigint;

  // 퀴즈 ID
  @ManyToOne((type) => QuizEntity, (quiz) => quiz.quiz_id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'quiz_id' })
  quiz_id: QuizEntity;

  // 단어 ID
  @ManyToOne((type) => WordEntity, (word) => word.word_id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'word_id' })
  word_id: WordEntity;
}
