import { IsNotEmpty } from 'class-validator';
import { UserEntity } from 'src/services/user/entities/user.entity';
import { BoardEntity } from '../entities/board.entity';

export class CreatePostDto {
  @IsNotEmpty()
  board_id: BoardEntity;

  @IsNotEmpty()
  user_id: UserEntity;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  content: string;
}

export class UpdatePostDto {}
