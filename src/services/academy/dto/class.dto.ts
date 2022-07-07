import { PartialType } from '@nestjs/mapped-types';

export class CreateClassDto {}

export class UpdateClassDto extends PartialType(CreateClassDto) {}
