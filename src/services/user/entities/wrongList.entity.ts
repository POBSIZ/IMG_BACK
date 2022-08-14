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

@Entity('WrongList')
export class WrongListEntity extends BaseEntity {
  // 오답 목록 ID
  @PrimaryGeneratedColumn({ type: 'bigint' })
  wrongList_id: bigint;

  // 유저퀴즈 ID
  @ManyToOne((type) => UserQuizEntity, (userQuiz) => userQuiz.userQuiz_id, {
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
