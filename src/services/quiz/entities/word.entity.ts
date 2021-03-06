import {
  Column,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
  BaseEntity,
} from 'typeorm';

import { BookEntity } from './book.entity';
import { AudioEntity } from 'src/services/audio/entities/audio.entity';

@Entity('Word')
export class WordEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  word_id: bigint | number;

  @ManyToOne((type) => BookEntity, (book) => book.book_id, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'book_id' })
  book_id: BookEntity;

  @Column({ type: 'varchar' })
  word: string;

  @Column({ type: 'varchar' })
  diacritic: string;

  @Column({ type: 'varchar' })
  meaning: string;

  @Column({ type: 'varchar' })
  type: string;
}
