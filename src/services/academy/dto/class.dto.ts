import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty } from 'class-validator';
import { AcademyEntity } from '../entities/academy.entity';
export class CreateClassDto {
  @IsNotEmpty()
  academy_id: AcademyEntity; // 학원 ID

  @IsNotEmpty()
  name: string; // 반 이름
}

export class UpdateClassDto extends PartialType(CreateClassDto) {}
