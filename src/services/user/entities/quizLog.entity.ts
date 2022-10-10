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
  @PrimaryGeneratedColumn({ type: 'integer' })
  quizLog_id: string;

  // 유저 ID
  @ManyToOne((type) => UserEntity, (user) => user.user_id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user_id: UserEntity;

  // 유저퀴즈 ID
  @ManyToOne((type) => UserQuizEntity, (userQuiz) => userQuiz.userQuiz_id, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'userQuiz_id' })
  @Column({ nullable: true })
  userQuiz_id: UserQuizEntity;

  // 오답목록 ID
  @ManyToOne((type) => WrongListEntity, (wrongList) => wrongList.wrongList_id)
  @JoinColumn({ name: 'wrongList_id' })
  @Column({ nullable: true })
  wrongList_id: WrongListEntity;

  // 퀴즈 제목
  @Column({ type: 'varchar' })
  quiz_title: string;

  // 점수
  @Column({ type: 'integer' })
  score: number;

  // 문제수
  @Column({ type: 'integer' })
  max_words: number;

  // 풀이시간
  @Column({ type: 'integer', nullable: true, default: 10 })
  time: number;

  // 생성일
  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;
}
