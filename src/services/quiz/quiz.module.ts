import { Module } from '@nestjs/common';
import { QuizsService } from './quiz.service';
import { QuizsController } from './quiz.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AudioModule } from '../audio/audio.module';

import { QuizEntity } from './entities/quiz.entity';
import { BookEntity } from './entities/book.entity';
import { ProbEntity } from './entities/prob.entity';
import { OptionEntity } from './entities/option.entity';
import { WordEntity } from './entities/word.entity';
import { UserQuizEntity } from '../user/entities/userQuiz.entity';

import { AcademyEntity } from '../academy/entities/academy.entity';
import { ClassEntity } from '../academy/entities/class.entity';

import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../user/jwt/jwt.strategy';

@Module({
  imports: [
    // session을 사용하지 않을 예정이기 때문에 false
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    // jwt 생성할 때 사용할 시크릿 키와 만료일자 적어주기
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '2h' },
    }),
    TypeOrmModule.forFeature([
      QuizEntity,
      BookEntity,
      ProbEntity,
      OptionEntity,
      WordEntity,
      UserQuizEntity,
      AudioModule,
      AcademyEntity,
      ClassEntity,
    ]),
    AudioModule,
  ],
  controllers: [QuizsController],
  exports: [TypeOrmModule],
  providers: [QuizsService, JwtStrategy],
})
export class QuizModule {}
