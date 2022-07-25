import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtStrategy } from '../user/jwt/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { BoardEntity } from './entities/board.entity';
import { PostEntity } from './entities/post.entity';
import { CommentEntity } from './entities/comment.entity';
import { ReplyEntity } from './entities/reply.entity';

import { UserEntity } from '../user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BoardEntity,
      PostEntity,
      CommentEntity,
      ReplyEntity,
      UserEntity,
    ]),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '2h' },
    }),
  ],
  controllers: [BoardController],
  providers: [BoardService, JwtStrategy],
  exports: [TypeOrmModule],
})
export class BoardModule {}
