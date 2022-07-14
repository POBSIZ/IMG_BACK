import { IsNotEmpty } from 'class-validator';
import { AcademyEntity } from 'src/services/academy/entities/academy.entity';
import { ClassEntity } from 'src/services/academy/entities/class.entity';
import { Roles } from '../entities/user.entity';

export class CreateUserDto {
  // 이름
  @IsNotEmpty()
  name: string;

  // 닉네임
  @IsNotEmpty()
  nickname: string;

  // 아이디
  @IsNotEmpty()
  username: string;

  // 비밀번호
  @IsNotEmpty()
  password: string;

  // 전화번호
  @IsNotEmpty()
  phone: string;

  // 권한
  @IsNotEmpty()
  role: Roles;

  // 학생 >

  // 학교
  school: string;

  // 학년
  grade: string;

  // 반 ID
  class_id: ClassEntity;

  // 학원 관계자 >

  // 주소
  address: string;

  // 우편번호
  zip: string;

  // 상세주소
  address_detail: string;

  // 학생, 학원 관계자 Both >

  // 학원 ID
  academy_id: AcademyEntity;
}
