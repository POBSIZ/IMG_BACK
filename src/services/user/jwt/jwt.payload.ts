import { AcademyEntity } from 'src/services/academy/entities/academy.entity';
import { ClassEntity } from 'src/services/academy/entities/class.entity';
import { Roles } from '../entities/user.entity';
import { UserEntity } from '../entities/user.entity';

export interface Payload {
  // 유저 ID
  user_id: bigint | number;

  // 연결 ID
  chain_id: bigint | number;

  // 이름
  name: string;

  // 닉네임
  nickname: string;

  // 전화번호
  phone: string;

  // 권한
  role: Roles;

  // 생성일
  created_at: Date;

  school: string; // 학교

  grade: string; // 학년

  class_id: number | bigint | ClassEntity; // 반 ID

  address: string; // 주소

  zip: string; // 우편번호

  address_detail: string; // 상세 주소

  academy_admin: boolean; // 학원 권한

  academy_id: number | bigint | AcademyEntity; // 학원 ID

  isValidate: boolean;
}
