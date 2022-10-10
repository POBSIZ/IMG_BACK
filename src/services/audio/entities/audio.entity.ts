import { WordEntity } from 'src/services/quiz/entities/word.entity';
import {
  Column,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  BaseEntity,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity('Audio')
export class AudioEntity extends BaseEntity {
  // 오디오 ID
  @PrimaryGeneratedColumn({ type: 'integer' })
  audio_id: string;

  // 단어 ID
  @OneToOne((type) => WordEntity, (word) => word.word_id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'word_id' })
  @Column({ nullable: true })
  word_id: WordEntity;

  // 파일명
  @Column({ type: 'varchar' })
  file_name: string;

  // 위치
  @Column({ type: 'varchar' })
  url: string;

  // 생성일
  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;
}
