import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor, FileInterceptor } from '@nestjs/platform-express';

import { diskStorage } from 'multer';
import { extname } from 'path';

import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/board.dto';

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post('create')
  async create(@Body() createBoardDto: CreateBoardDto) {
    return this.boardService.create(createBoardDto);
  }

  @Get('all')
  async getAll() {
    return this.boardService.getAll();
  }

  @Get('list/:id')
  async getBoardList(@Param('id') id) {
    return this.boardService.getBoardList(id);
  }

  @Post('upload/image')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: (req, file, cb) => {
          cb(null, 'static/board/imgs');
        },
        filename: (req, file, cb) => {
          cb(null, `${file.originalname}`);
        },
      }),
    }),
  )
  async uploadImage(@UploadedFiles() file, @Req() req) {
    return await this.boardService.uploadImage(file, req);
  }
}
