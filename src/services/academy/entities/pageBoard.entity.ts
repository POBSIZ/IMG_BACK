import { BoardEntity } from 'src/services/board/entities/board.entity';
import {
  Column,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  BaseEntity,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { AcademyEntity } from './academy.entity';
import { PageEntity } from './page.entity';

@Entity('PageBoard')
export class PageBoardEntity extends BaseEntity {
  // 페이지 게시판 ID
  @PrimaryGeneratedColumn({ type: 'integer' })
  PageBoard_id: string;

  // 페이지 ID
  @ManyToOne((type) => PageEntity, (page) => page.page_id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'page_id' })
  @Column({ nullable: false })
  page_id: PageEntity;

  // 게시판 ID
  @ManyToOne((type) => BoardEntity, (board) => board.board_id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'board_id' })
  @Column({ nullable: false })
  board_id: BoardEntity;

  // 생성일
  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;
}
