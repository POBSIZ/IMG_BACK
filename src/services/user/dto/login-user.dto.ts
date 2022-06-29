import { IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  // 아이디
  @IsNotEmpty()
  username: string;

  // 비밀번호
  @IsNotEmpty()
  password: string;
}
