import {
  Column,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  BaseEntity,
} from 'typeorm';

@Entity('Audio')
export class AudioEntity extends BaseEntity {
  // 오디오 ID
  @PrimaryGeneratedColumn()
  audio_id: bigint | number;

  // 파일명
  @Column({ type: 'varchar' })
  file_name: string;

  // 위치
  @Column({ type: 'varchar' })
  url: string;

  // 생성일
  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;
}
