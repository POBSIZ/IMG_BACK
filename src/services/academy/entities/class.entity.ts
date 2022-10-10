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

@Entity('Class')
export class ClassEntity extends BaseEntity {
  // 반 ID
  @PrimaryGeneratedColumn({ type: 'integer' })
  class_id: string;

  // 학원 ID
  @ManyToOne((type) => AcademyEntity, (academy) => academy.academy_id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'academy_id' })
  @Column({ nullable: false })
  academy_id: AcademyEntity;

  @Column({ type: 'varchar' })
  name: string;

  // 생성일
  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;
}
