import { Module } from '@nestjs/common';
import { UsersService } from './user.service';
import { UsersController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt/jwt.strategy';

import { UserEntity } from './entities/user.entity';
import { UserQuizEntity } from './entities/userQuiz.entity';
import { QuizEntity } from '../quiz/entities/quiz.entity';
import { WrongListEntity } from './entities/wrongList.entity';
import { WrongEntity } from './entities/wrong.entity';
import { QuizLogEntity } from './entities/quizLog.entity';
import { ProbEntity } from '../quiz/entities/prob.entity';
import { AcademyEntity } from '../academy/entities/academy.entity';
import { ClassEntity } from '../academy/entities/class.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      UserQuizEntity,
      QuizEntity,
      WrongListEntity,
      WrongEntity,
      QuizLogEntity,
      ProbEntity,
      AcademyEntity,
      ClassEntity,
    ]),
    // session을 사용하지 않을 예정이기 때문에 false
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    // jwt 생성할 때 사용할 시크릿 키와 만료일자 적어주기
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '2h' },
    }),
  ],
  controllers: [UsersController],
  exports: [TypeOrmModule],
  providers: [UsersService, JwtStrategy],
})
export class UserModule {}
