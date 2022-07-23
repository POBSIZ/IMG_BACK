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

import { PostEntity } from './post.entity';
import { BoardStatus } from './board.entity';

@Entity('Comment')
export class CommentEntity extends BaseEntity {
  // 댓글 ID
  @PrimaryGeneratedColumn({ type: 'bigint' })
  comment_id: bigint | number;

  // 게시글 ID
  @ManyToOne((type) => PostEntity, (post) => post.post_id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'post_id' })
  @Column({ nullable: false })
  post_id: PostEntity;

  // 작성자 ID
  @ManyToOne((type) => UserEntity, (user) => user.user_id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  @Column({ nullable: false })
  user_id: UserEntity;

  // 내용
  @Column({ type: 'text' })
  contents: string;

  // 추천수
  @Column({ type: 'bigint', default: 0 })
  like: number | bigint;

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
