import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IncomingMessage } from 'http';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { CreateBoardDto } from './dto/board.dto';
import { CreatePostDto } from './dto/post.dto';
import { BoardEntity } from './entities/board.entity';
import { PostEntity } from './entities/post.entity';

import jwt from 'jwt-decode';
import { Payload } from '../user/jwt/jwt.payload';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

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
      return await this.boardRepository.find({ cache: 1000 });
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
        .cache(true)
        .getMany();
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  // 게시글 생성
  async createPost(data: Partial<CreatePostDto>, req: IncomingMessage) {
    try {
      const userInfo: Payload = await jwt(req.headers.authorization);

      const createPostDto = new CreatePostDto();

      createPostDto.user_id = await this.userRepository.findOneBy([
        { user_id: Number(userInfo.user_id) },
      ]);

      createPostDto.board_id = await this.boardRepository.findOneBy([
        { board_id: Number(data.board_id) },
      ]);

      createPostDto.title = data.title;
      createPostDto.content = data.content;

      await this.postRepository.save(createPostDto);
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 500);
    }
  }

  async deletePost(id, req) {
    try {
      const post = await this.postRepository.findOneBy([
        { post_id: Number(id) },
      ]);
      await this.postRepository.remove(post);
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  // 게시글 가져오기
  async getPost(id) {
    try {
      return await this.postRepository
        .createQueryBuilder('post')
        .where('post.post_id = :post_id', { post_id: Number(id) })
        .leftJoinAndSelect('post.user_id', 'user_id')
        .cache(true)
        .getOne();
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
