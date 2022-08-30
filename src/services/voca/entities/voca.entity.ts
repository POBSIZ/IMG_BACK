import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { UserEntity } from 'src/services/user/entities/user.entity';

@Entity('Voca')
export class VocaEntity extends BaseEntity {
  // 단어장 ID
  @PrimaryGeneratedColumn({ type: 'bigint' })
  voca_id: bigint | number;

  // 유저 ID
  @ManyToOne((type) => UserEntity, (user) => user.user_id, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'user_id' })
  @Column({ nullable: true })
  user_id: UserEntity;

  // 단어장 이름
  @Column({ type: 'varchar' })
  name: string;

  // 단어장 원문
  @Column({ type: 'text', nullable: true, default: null })
  origin: string;

  // 생성일
  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;
}
