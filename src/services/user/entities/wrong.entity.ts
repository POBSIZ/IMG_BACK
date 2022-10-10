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
import { ProbEntity } from 'src/services/quiz/entities/prob.entity';

@Entity('Wrong')
export class WrongEntity extends BaseEntity {
  // 오답 ID
  @PrimaryGeneratedColumn({ type: 'integer' })
  wrong_id: string;

  // 오답목록 ID
  @ManyToOne((type) => WrongListEntity, (wrongList) => wrongList.wrongList_id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'wrongList_id' })
  wrongList_id: WrongListEntity;

  // 문제 ID
  @ManyToOne((type) => ProbEntity, (prob) => prob.prob_id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'prob_id' })
  prob_id: ProbEntity;

  // 오답 단어 (유저가 선택한 단어)
  @Column({ type: 'varchar' })
  wrong_word: string;
}
