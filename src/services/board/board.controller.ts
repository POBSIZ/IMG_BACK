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
  UseGuards,
} from '@nestjs/common';
import { FilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { IncomingMessage } from 'http';

import { diskStorage } from 'multer';
import { JwtAuthGuard } from '../user/jwt/jwt.guard';

import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/board.dto';
import { CreatePostDto } from './dto/post.dto';

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  // 게시판 생성
  @Post('create')
  async create(@Body() createBoardDto: CreateBoardDto) {
    return this.boardService.create(createBoardDto);
  }

  // 게시판 모두불러오기
  @Get('all')
  async getAll() {
    return this.boardService.getAll();
  }

  // 게시판 일부 목록 불러오기
  @Get('list/:id')
  async getBoardList(@Param('id') id: string) {
    return this.boardService.getBoardList(id);
  }

  // 게시글 생성
  @UseGuards(JwtAuthGuard)
  @Post('post/create')
  async createPost(
    @Body() data: Partial<CreatePostDto>,
    @Req() req: IncomingMessage,
  ) {
    return this.boardService.createPost(data, req);
  }

  // 게시글 수정
  @UseGuards(JwtAuthGuard)
  @Patch('post/patch')
  async patchPost(
    @Body() data: Partial<CreatePostDto>,
    @Req() req: IncomingMessage,
  ) {
    return this.boardService.patchPost(data, req);
  }

  // 게시글 삭제
  @UseGuards(JwtAuthGuard)
  @Delete('post/delete/:id')
  async deletePost(@Param('id') id, @Req() req: IncomingMessage) {
    return this.boardService.deletePost(id, req);
  }

  // 게시글 불러오기
  @Get('post/:id')
  async getPost(@Param('id') id) {
    return this.boardService.getPost(id);
  }

  // 이미지 업로드
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
