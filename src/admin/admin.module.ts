import { Module } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AdminModule as AdminBroModule } from '@adminjs/nestjs';
import AdminJS from 'adminjs';
import { Database, Resource } from '@adminjs/typeorm';
import { validate } from 'class-validator';

import { UserModule } from 'src/services/user/user.module';
import { QuizModule } from 'src/services/quiz/quiz.module';
import { AudioModule } from 'src/services/audio/audio.module';

import EntityArr from './entity.array';

Resource.validate = validate;
AdminJS.registerAdapter({ Database, Resource });

@Module({
  imports: [
    AdminBroModule.createAdminAsync({
      imports: [UserModule, QuizModule, AudioModule],
      // inject: [getRepositoryToken(UserEntity)],
      useFactory: () => ({
        adminJsOptions: {
          rootPath: '/adminpage',
          loginPath: '/adminpage/login',
          logoutPath: '/adminpage/logout',
          resources: EntityArr,
          branding: {
            companyName: 'IMG English',
          },
        },
        auth: {
          authenticate: async (email, password) => {
            return Promise.resolve({ email: 'test' });
          },
          cookieName: 'test',
          cookiePassword: '1234',
        },
      }),
    }),
  ],
})
export class AdminModule {}
