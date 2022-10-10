import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty } from 'class-validator';

import { UserEntity } from '../entities/user.entity';
import { QuizEntity } from 'src/services/quiz/entities/quiz.entity';
import { UserQuizEntity } from '../entities/userQuiz.entity';

export class CreateUserQuizDto extends PartialType(UserQuizEntity) {}

export class UpdateUserQuizDto extends PartialType(CreateUserQuizDto) {}
