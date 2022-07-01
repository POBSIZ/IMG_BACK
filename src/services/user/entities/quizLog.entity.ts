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

import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';
import { UserQuizEntity } from './userQuiz.entity';
import { WrongListEntity } from './wrongList.entity';
import { UserEntity } from './user.entity';
import { ProbEntity } from 'src/services/quiz/entities/prob.entity';

@Entity('QuizLog')
export class QuizLogEntity extends BaseEntity {
  // 퀴즈로그 ID
  @PrimaryGeneratedColumn({ type: 'bigint' })
  quizLog_id: bigint;

  // 유저퀴즈 ID
  @ManyToOne((type) => UserQuizEntity, (userQuiz) => userQuiz.userQuiz_id, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'userQuiz_id' })
  userQuiz_id: UserQuizEntity;

  // 오답목록 ID
  @ManyToOne((type) => WrongListEntity, (wrongList) => wrongList.wrongList_id, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'wrongList_id' })
  wrongList_id: WrongListEntity;

  // 점수
  @Column({ type: 'integer' })
  score: number;

  // 생성일
  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;
}
