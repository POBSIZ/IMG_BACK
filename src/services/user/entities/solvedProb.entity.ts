import {
  Column,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  BaseEntity,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { ProbEntity } from 'src/services/quiz/entities/prob.entity';
import { UserQuizEntity } from './userQuiz.entity';

@Entity('SolvedProb')
export class SolvedProbEntity extends BaseEntity {
  // 푼 문제 ID
  @PrimaryGeneratedColumn({ type: 'integer' })
  solvedProb_id: string;

  // 유저퀴즈 ID
  @ManyToOne((type) => UserQuizEntity, (userQuiz) => userQuiz.userQuiz_id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userQuiz_id' })
  @Column({ nullable: true })
  userQuiz_id: UserQuizEntity;

  // 문제 ID
  @ManyToOne((type) => ProbEntity, (prob) => prob.prob_id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'prob_id' })
  @Column({ nullable: true })
  prob_id: ProbEntity;
}
