import { IsNotEmpty } from 'class-validator';

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

  // 학교
  @IsNotEmpty()
  school: string;

  // 학년
  @IsNotEmpty()
  grade: string;

  // 전화번호
  @IsNotEmpty()
  phone: string;
}
