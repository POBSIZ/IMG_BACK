import { Roles } from '../entities/user.entity';

export type Payload = {
  user_id: number | bigint; // 회원 ID
  name: string; // 이름
  phone: string; // 전화번호
  role: Roles; // 권한
  created_at: Date; // 생성일
  school: string; // 학교
  grade: string; // 학년
  class_id: number | bigint; // 반 ID
  address: string; // 주소
  zip: string; // 우편번호
  address_detail: string; // 상세 주소
  academy_id: number | bigint; // 학원 ID
  isValidate: boolean;
};
