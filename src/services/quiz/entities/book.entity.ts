import {
  Column,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  BaseEntity,
} from 'typeorm';

@Entity('Book')
export class BookEntity extends BaseEntity {
  // 책 ID
  @PrimaryGeneratedColumn({ type: 'bigint' })
  book_id: number;

  // 책 제목
  @Column({ type: 'varchar' })
  title: string;

  // 책 설명
  @Column({ type: 'text', nullable: true })
  desc: string;

  // 생성일
  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;
}
