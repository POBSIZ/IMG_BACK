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
  @PrimaryGeneratedColumn({ type: 'integer' })
  word_id: string;

  @ManyToOne((type) => BookEntity, (book) => book.book_id, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'book_id' })
  @Column({ nullable: true, default: null })
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
