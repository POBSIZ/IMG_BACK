import { IsNotEmpty } from 'class-validator';

export class CreateAudioDto {
  @IsNotEmpty()
  file_name: string;

  @IsNotEmpty()
  url: string;
}
