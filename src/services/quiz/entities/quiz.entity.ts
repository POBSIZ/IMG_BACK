import { AcademyEntity } from 'src/services/academy/entities/academy.entity';
import {
  Column,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

export enum QuizType {
  IN_PREV = 'IN_PREV',
  EX_PREV = 'EX_PREV',
  STATIC = 'STATIC',
}

@Entity('Quiz')
export class QuizEntity extends BaseEntity {
  // 퀴즈 ID
  @PrimaryGeneratedColumn({ type: 'bigint' })
  quiz_id: number | bigint;

  // 학원 ID
  @ManyToOne((type) => AcademyEntity, (academy) => academy.academy_id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'academy_id' })
  @Column({ nullable: true })
  academy_id: AcademyEntity;

  // 방식
  @Column({ type: 'enum', enum: QuizType, default: QuizType.IN_PREV })
  type: QuizType;

  // 퀴즈 제목
  @Column({ type: 'varchar' })
  title: string;

  // 사용 가능 개수
  @Column({ type: 'integer', nullable: true, default: null })
  available_counts: number;

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
