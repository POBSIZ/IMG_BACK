import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

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
  ],
  controllers: [BoardController],
  providers: [BoardService],
  exports: [TypeOrmModule],
})
export class BoardModule {}
