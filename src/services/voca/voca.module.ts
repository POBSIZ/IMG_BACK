import { Module } from '@nestjs/common';
import { VocaService } from './voca.service';
import { VocaController } from './voca.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { VocaEntity } from './entities/voca.entity';
import { VocaWordEntity } from './entities/vocaWord.entity';
import { WordEntity } from '../quiz/entities/word.entity';
import { UserEntity } from '../user/entities/user.entity';
import { QuizEntity } from '../quiz/entities/quiz.entity';
import { ProbEntity } from '../quiz/entities/prob.entity';
import { OptionEntity } from '../quiz/entities/option.entity';
import { UserQuizEntity } from '../user/entities/userQuiz.entity';
import { VocaQuizEntity } from './entities/vocaQuiz.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VocaEntity,
      VocaWordEntity,
      VocaQuizEntity,
      WordEntity,
      UserEntity,
      QuizEntity,
      ProbEntity,
      OptionEntity,
      UserQuizEntity,
    ]),
  ],
  controllers: [VocaController],
  exports: [TypeOrmModule],
  providers: [VocaService],
})
export class VocaModule {}
