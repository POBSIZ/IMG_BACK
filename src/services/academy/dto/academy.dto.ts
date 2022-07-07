import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty } from 'class-validator';

export class CreateAcademyDto {
  // 학원명
  @IsNotEmpty()
  name: string;

  // 대표자 이름
  @IsNotEmpty()
  president_name: string;

  // 대표번호
  @IsNotEmpty()
  phone: string;

  // 주소
  @IsNotEmpty()
  address: string;

  // 우편번호
  @IsNotEmpty()
  zip: string;

  // 상세주소
  @IsNotEmpty()
  address_detail: string;
}

export class UpdateAcademyDto extends PartialType(CreateAcademyDto) {}
