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

import { ProbEntity } from './prob.entity';
import { WordEntity } from './word.entity';

@Entity('Option')
export class OptionEntity extends BaseEntity {
  // 문항 ID
  @PrimaryGeneratedColumn({ type: 'bigint' })
  book_id: bigint;

  // 문제 ID
  @ManyToOne((type) => ProbEntity, (prob) => prob.prob_id)
  @JoinColumn({ name: 'prob_id' })
  prob_id: ProbEntity;

  // 단어 ID
  @ManyToOne((type) => WordEntity, (word) => word.word_id)
  @JoinColumn({ name: 'word_id' })
  word_id: WordEntity;
}
