import { Module } from '@nestjs/common';
import { AcademyService } from './academy.service';
import { AcademyController } from './academy.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AcademyEntity } from './entities/academy.entity';
import { ClassEntity } from './entities/class.entity';
import { UserEntity } from '../user/entities/user.entity';
import { QuizEntity } from '../quiz/entities/quiz.entity';
import { BookEntity } from '../quiz/entities/book.entity';
import { UserQuizEntity } from '../user/entities/userQuiz.entity';

import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../user/jwt/jwt.strategy';
import { PageEntity } from './entities/page.entity';
import { PageBoardEntity } from './entities/pageBoard.entity';
import { BoardEntity } from '../board/entities/board.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AcademyEntity,
      ClassEntity,
      UserEntity,
      QuizEntity,
      BookEntity,
      UserQuizEntity,
      PageEntity,
      PageBoardEntity,
      BoardEntity,
    ]),
    // session을 사용하지 않을 예정이기 때문에 false
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    // jwt 생성할 때 사용할 시크릿 키와 만료일자 적어주기
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '2h' },
    }),
  ],

  controllers: [AcademyController],
  providers: [AcademyService, JwtStrategy],
})
export class AcademyModule {}
