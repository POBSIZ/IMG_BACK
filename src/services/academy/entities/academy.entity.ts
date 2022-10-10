import {
  Column,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  BaseEntity,
  OneToOne,
  JoinColumn,
  ObjectID,
} from 'typeorm';

@Entity('Academy')
export class AcademyEntity extends BaseEntity {
  // 학원 ID
  @PrimaryGeneratedColumn({ type: 'integer' })
  academy_id: string;

  // 학원명
  @Column({ type: 'varchar' })
  name: string;

  // 대표자 이름
  @Column({ type: 'varchar' })
  president_name: string;

  // 대표번호
  @Column({ type: 'varchar' })
  phone: string;

  // 주소
  @Column({ type: 'varchar' })
  address: string;

  // 우편번호
  @Column({ type: 'varchar' })
  zip: string;

  // 상세주소
  @Column({ type: 'varchar' })
  address_detail: string;

  // 생성일
  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;
}
