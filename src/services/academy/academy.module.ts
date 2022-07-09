import { Module } from '@nestjs/common';
import { AcademyService } from './academy.service';
import { AcademyController } from './academy.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AcademyEntity } from './entities/academy.entity';
import { ClassEntity } from './entities/class.entity';
import { UserEntity } from '../user/entities/user.entity';
import { QuizEntity } from '../quiz/entities/quiz.entity';
import { BookEntity } from '../quiz/entities/book.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AcademyEntity,
      ClassEntity,
      UserEntity,
      QuizEntity,
      BookEntity,
    ]),
  ],
  controllers: [AcademyController],
  providers: [AcademyService],
})
export class AcademyModule {}
