import { WordEntity } from 'src/services/quiz/entities/word.entity';
import { UserEntity } from 'src/services/user/entities/user.entity';
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
  ManyToOne,
} from 'typeorm';
import { BoardEntity, BoardStatus } from './board.entity';

@Entity('Post')
export class PostEntity extends BaseEntity {
  // 게시글 ID
  @PrimaryGeneratedColumn({ type: 'bigint' })
  post_id: bigint | number;

  // 게시판 ID
  @ManyToOne((type) => BoardEntity, (board) => board.board_id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'board_id' })
  @Column({ nullable: false })
  board_id: BoardEntity;

  // 작성자 ID
  @ManyToOne((type) => UserEntity, (user) => user.user_id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  @Column({ nullable: false })
  user_id: UserEntity;

  // 썸네일
  @Column({ type: 'varchar', nullable: true, default: null })
  thumbnail: string;

  // 제목
  @Column({ type: 'varchar' })
  title: string;

  // 설명
  @Column({ type: 'varchar', nullable: true, default: null })
  desc: string;

  // 내용
  @Column({ type: 'text' })
  content: string;

  // 추천수
  @Column({ type: 'bigint', default: 0 })
  like: number | bigint;

  // 공지글
  @Column({ type: 'boolean', default: false })
  is_notice: boolean;

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
