import {
  Column,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  BaseEntity,
} from 'typeorm';

import { UserEntity } from './user.entity';
import { QuizEntity } from 'src/services/quiz/entities/quiz.entity';

@Entity('UserQuiz')
export class UserQuizEntity extends BaseEntity {
  // 유저 퀴즈 ID
  @PrimaryGeneratedColumn({ type: 'bigint' })
  userQuiz_id: bigint | number;

  // 회원 ID
  @ManyToOne((type) => UserEntity, (user) => user.user_id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user_id: UserEntity;

  // 퀴즈 ID
  @ManyToOne((type) => QuizEntity, (quiz) => quiz.quiz_id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'quiz_id' })
  quiz_id: QuizEntity;

  // 시도횟수
  @Column({ type: 'integer', default: 0 })
  try_count: number;

  // 최고성적
  @Column({ type: 'integer', default: 0 })
  best_solve: number;

  // 최고성적
  @Column({ type: 'boolean', default: false })
  disabled: boolean;

  // 생성일
  @UpdateDateColumn({
    default: () => 'CURRENT_TIMESTAMP',
    type: 'timestamp with time zone',
  })
  recent_date: Date;
}
