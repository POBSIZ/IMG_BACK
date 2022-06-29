import { Module } from '@nestjs/common';
import { AudiosService } from './audio.service';
import { AudiosController } from './audio.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AudioEntity } from './entities/audio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AudioEntity])],
  controllers: [AudiosController],
  providers: [AudiosService],
  exports: [TypeOrmModule],
})
export class AudioModule {}
