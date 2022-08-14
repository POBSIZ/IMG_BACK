import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty } from 'class-validator';
import { BoardEntity } from 'src/services/board/entities/board.entity';
import { PageEntity } from '../entities/page.entity';

export class CreatePageBoardDto {
  // 페이지 ID
  @IsNotEmpty()
  page_id: PageEntity;

  // 게시판 ID
  @IsNotEmpty()
  board_id: BoardEntity;
}

export class UpdatePageBoardDto extends PartialType(CreatePageBoardDto) {}
