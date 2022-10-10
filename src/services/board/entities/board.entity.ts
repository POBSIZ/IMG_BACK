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
  UpdateDateColumn,
} from 'typeorm';

export enum BoardStatus {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

@Entity('Board')
export class BoardEntity extends BaseEntity {
  // 게시판 ID
  @PrimaryGeneratedColumn({ type: 'integer' })
  board_id: string;

  // 이름
  @Column({ type: 'varchar' })
  title: string;

  // 설명
  @Column({ type: 'varchar' })
  desc: string;

  // 상태
  @Column({ type: 'varchar', enum: BoardStatus, default: BoardStatus.PUBLIC })
  status: BoardStatus;

  // 수정일
  @UpdateDateColumn({
    default: () => 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  // 생성일
  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;
}
