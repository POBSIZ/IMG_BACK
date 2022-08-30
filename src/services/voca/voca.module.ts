import { Module } from '@nestjs/common';
import { VocaService } from './voca.service';
import { VocaController } from './voca.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { VocaEntity } from './entities/voca.entity';
import { VocaWordEntity } from './entities/vocaWord.entity';
import { WordEntity } from '../quiz/entities/word.entity';
import { UserEntity } from '../user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VocaEntity,
      VocaWordEntity,
      WordEntity,
      UserEntity,
    ]),
  ],
  controllers: [VocaController],
  exports: [TypeOrmModule],
  providers: [VocaService],
})
export class VocaModule {}
