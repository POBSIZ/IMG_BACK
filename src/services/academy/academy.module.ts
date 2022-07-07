import { Module } from '@nestjs/common';
import { AcademyService } from './academy.service';
import { AcademyController } from './academy.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AcademyEntity } from './entities/academy.entity';
import { ClassEntity } from './entities/class.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AcademyEntity, ClassEntity])],
  controllers: [AcademyController],
  providers: [AcademyService],
})
export class AcademyModule {}
