import {
  Column,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  BaseEntity,
  BeforeInsert,
} from 'typeorm';

import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';

@Entity('User')
export class UserEntity extends BaseEntity {
  // 유저 ID
  @PrimaryGeneratedColumn({ type: 'bigint' })
  user_id: bigint | number;

  // 이름
  @Column({ type: 'varchar' })
  name: string;

  // 아이디
  @Column({ type: 'varchar', unique: true })
  username: string;

  // 비밀번호
  @Column({ type: 'varchar' })
  password: string;

  // 학교
  @Column({ type: 'varchar' })
  school: string;

  // 학년
  @Column({ type: 'varchar' })
  grade: string;

  // 전화번호
  @Column({ type: 'varchar' })
  phone: string;

  // 권한
  @Column({ type: 'varchar', default: 'student' })
  role: string;

  // 생성일
  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    try {
      const salt = 10;
      // const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }
}
