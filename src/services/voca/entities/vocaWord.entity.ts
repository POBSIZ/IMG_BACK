import { WordEntity } from 'src/services/quiz/entities/word.entity';
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { VocaEntity } from './voca.entity';

@Entity('VocaWord')
export class VocaWordEntity extends BaseEntity {
  // 단어장 단어 ID
  @PrimaryGeneratedColumn({ type: 'bigint' })
  vocaWord_id: bigint | number;

  // 단어장 ID
  @ManyToOne((type) => VocaEntity, (voca) => voca.voca_id, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'voca_id' })
  voca_id: VocaEntity;

  // 단어 ID
  @ManyToOne((type) => WordEntity, (word) => word.word_id, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'word_id' })
  word_id: WordEntity;

  // 라벨
  @Column({ type: 'integer', nullable: true, default: null })
  label: number;
}
