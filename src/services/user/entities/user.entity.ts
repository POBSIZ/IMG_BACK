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
import { ConfigService } from '@nestjs/config';

export enum Roles {
  ADMIN = 'admin',
  STUDENT = 'student',
  PARENTS = 'parents',
  INSIDER = 'insider',
}

@Entity('User')
export class UserEntity extends BaseEntity {
  constructor(private readonly configService: ConfigService) {
    super();
  }

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

  // 전화번호
  @Column({ type: 'varchar' })
  phone: string;

  // 권한
  @Column({ type: 'enum', enum: Roles, default: Roles.STUDENT })
  role: Roles;

  // 생성일
  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  /**
   * 학생 Student
   * @param {school, grade, } Data 학교 학년
   */

  @Column({ type: 'varchar', nullable: true })
  school: string; // 학교

  @Column({ type: 'varchar', nullable: true })
  grade: string; // 학년

  /**
   * 학원 관계자 Insider
   * @param {address} Data
   */

  @Column({ type: 'varchar', nullable: true })
  address: string; // 주소

  @Column({ type: 'varchar', nullable: true })
  zip: string; // 우편번호

  @Column({ type: 'varchar', nullable: true })
  address_detail: string; // 상세 주소

  /**
   * 학생, 학원 관계자 Both
   */

  @Column({ type: 'varchar', nullable: true })
  academy: string; // 학원

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    try {
      const salt = 10;
      // const salt = Number(process.env.BCRYPT_SALT);
      // const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }
}
