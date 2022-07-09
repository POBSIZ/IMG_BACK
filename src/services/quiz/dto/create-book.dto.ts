import { IsNotEmpty } from 'class-validator';
import { AcademyEntity } from 'src/services/academy/entities/academy.entity';

export class CreateBookDto {
  // 학원 ID
  @IsNotEmpty()
  academy_id: AcademyEntity;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  file: string;
}
