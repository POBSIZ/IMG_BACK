import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty } from 'class-validator';

import { UserEntity } from 'src/services/user/entities/user.entity';

export class CreateVocaDto {
  @IsNotEmpty()
  user_id: UserEntity;

  @IsNotEmpty()
  name: string;

  origin: string;
}

export class UpdateVocaDto extends PartialType(CreateVocaDto) {}
