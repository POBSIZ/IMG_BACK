import {
  Column,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  BaseEntity,
} from 'typeorm';

@Entity('Quiz')
export class QuizEntity extends BaseEntity {
  // 퀴즈 ID
  @PrimaryGeneratedColumn({ type: 'bigint' })
  quiz_id: number;

  // 퀴즈 제목
  @Column({ type: 'varchar' })
  title: string;

  // 문제수
  @Column({ type: 'integer' })
  max_words: number;

  // 풀이 시간
  @Column({ type: 'integer', default: 5 })
  time: number;

  // 문항수
  @Column({ type: 'integer', default: 4 })
  max_options: number;

  // 생성일
  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;
}
