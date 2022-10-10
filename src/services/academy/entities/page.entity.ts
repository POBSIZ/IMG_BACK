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

@Entity('Page')
export class PageEntity extends BaseEntity {
  // 페이지 ID
  @PrimaryGeneratedColumn({ type: 'integer' })
  page_id: string;

  // 학원 ID
  @ManyToOne((type) => AcademyEntity, (academy) => academy.academy_id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'academy_id' })
  @Column({ nullable: true })
  academy_id: AcademyEntity;

  // 제목
  @Column({ type: 'varchar' })
  title: string;

  // 배경색
  @Column({ type: 'varchar', default: '#fff' })
  bg: string;

  // 배너 이미지
  @Column({ type: 'varchar' })
  banner: string;

  // 템플릿
  @Column({ type: 'varchar', default: 'default' })
  template: string;

  // 생성일
  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;
}
