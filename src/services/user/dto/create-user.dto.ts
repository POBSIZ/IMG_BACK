import { IsNotEmpty } from 'class-validator';
import { Roles } from '../entities/user.entity';

export class CreateUserDto {
  // 이름
  @IsNotEmpty()
  name: string;

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

  // 학교
  school: string;

  // 학년
  grade: string;

  // 주소
  address: string;

  // 우편번호
  zip: string;

  // 상세주소
  address_detail: string;

  // 학원이름
  academy: string;
}
