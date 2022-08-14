import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty } from 'class-validator';
import { AcademyEntity } from '../entities/academy.entity';

export class CreatePageDto {
  // 학원 ID
  @IsNotEmpty()
  academy_id: AcademyEntity;

  // 제목
  @IsNotEmpty()
  title: string;

  // 배경색
  bg: string;

  // 배너 이미지
  banner: string;

  // 템플릿
  template: string;
}

export class UpdatePageDto extends PartialType(CreatePageDto) {}
