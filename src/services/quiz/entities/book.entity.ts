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

@Entity('Book')
export class BookEntity extends BaseEntity {
  // 책 ID
  @PrimaryGeneratedColumn({ type: 'bigint' })
  book_id: number | bigint;

  // 학원 ID
  @ManyToOne((type) => AcademyEntity, (academy) => academy.academy_id, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'academy_id' })
  @Column({ nullable: true })
  academy_id: AcademyEntity;

  // 책 제목
  @Column({ type: 'varchar' })
  title: string;

  // 책 설명
  @Column({ type: 'text', nullable: true })
  desc: string;

  // 활성화
  @Column({ type: 'boolean', nullable: true, default: false })
  disabled: boolean;

  // 생성일
  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;
}
