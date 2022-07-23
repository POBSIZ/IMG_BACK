import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBoardDto } from './dto/board.dto';
import { BoardEntity } from './entities/board.entity';
import { PostEntity } from './entities/post.entity';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(BoardEntity)
    private readonly boardRepository: Repository<BoardEntity>,

    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
  ) {}

  // 게시판 생성
  async create(createBoardDto: CreateBoardDto) {
    try {
      const createDto = new CreateBoardDto();
      createDto.title = createBoardDto.title;
      createDto.desc = createBoardDto.desc;
      // console.log(createBoardDto);
      return await this.boardRepository.save(createDto);
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  // 게시판 모두 가져오기
  async getAll() {
    try {
      return await this.boardRepository.find();
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  // 특정 게시판 목록 가져오기
  async getBoardList(id) {
    try {
      return await this.postRepository
        .createQueryBuilder('post')
        .where('post.board_id = :board_id', { board_id: Number(id) })
        .leftJoinAndSelect('post.user_id', 'user_id')
        .getMany();
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  // WISYWYG 이미지 업로드
  async uploadImage(file, req) {
    try {
      return `/board/imgs/${file[0].originalname}`;
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 500);
    }
  }
}
