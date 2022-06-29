import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';

import { AdminModule } from './admin/admin.module';

import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './services/user/jwt/jwt.strategy';

import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from './services/user/user.module';
import { AudioModule } from './services/audio/audio.module';
import { QuizModule } from './services/quiz/quiz.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '010911',
      database: 'img_db',
      // database: 'img',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    // session을 사용하지 않을 예정이기 때문에 false
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    // jwt 생성할 때 사용할 시크릿 키와 만료일자 적어주기
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '2h' },
    }),
    ServeStaticModule.forRoot({
      rootPath: __dirname + '../../static',
    }),
    UserModule,
    AudioModule,
    QuizModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
