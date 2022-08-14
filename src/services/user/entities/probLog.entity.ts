import { ProbEntity } from 'src/services/quiz/entities/prob.entity';
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
import { QuizLogEntity } from './quizLog.entity';

@Entity('ProbLog')
export class ProbLogEntity extends BaseEntity {
  // 문제 로그 ID
  @PrimaryGeneratedColumn({ type: 'bigint' })
  probLog_id: bigint | number;

  // 퀴즈 로그 ID
  @ManyToOne((type) => QuizLogEntity, (quizLog) => quizLog.quizLog_id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'quizLog_id' })
  @Column({ nullable: false })
  quizLog_id: QuizLogEntity;

  // 문제 ID
  @ManyToOne((type) => ProbEntity, (prob) => prob.prob_id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'prob_id' })
  @Column({ nullable: false })
  prob_id: ProbEntity;
}
