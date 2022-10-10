import { HttpException, Injectable, Logger } from '@nestjs/common';
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
import { kStringMaxLength } from 'buffer';

@Injectable()
export class BoardService {
  private readonly logger = new Logger();

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
      this.logger.error(error);
      throw new HttpException(error, 500);
    }
  }

  // 게시판 모두 가져오기
  async getAll() {
    try {
      return await this.boardRepository.find({ cache: 1000 });
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error, 500);
    }
  }

  // 특정 게시판 목록 가져오기
  async getBoardList(id) {
    try {
      return await this.postRepository
        .createQueryBuilder('post')
        .where(`post.board_id = ${id}`)
        .leftJoinAndSelect('post.user_id', 'user_id')
        .leftJoinAndSelect('post.board_id', 'board_id')
        .cache(true)
        .getMany();
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error, 500);
    }
  }

  // 게시글 생성
  async createPost(data: Partial<CreatePostDto>, req: IncomingMessage) {
    try {
      const userInfo: Payload = await jwt(req.headers.authorization);

      const createPostDto = new CreatePostDto();

      createPostDto.user_id = await this.userRepository
        .createQueryBuilder('u')
        .where(`u.user_id = ${userInfo.user_id}`)
        .getOne();

      createPostDto.board_id = await this.boardRepository
        .createQueryBuilder('b')
        .where(`b.board_id = ${data.board_id}`)
        .getOne();

      createPostDto.title = data.title;
      createPostDto.content = data.content;
      createPostDto.thumbnail = data.thumbnail ?? null;

      await this.postRepository.save(createPostDto);
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error, 500);
    }
  }

  // 게시글 수정
  async patchPost(data: Partial<PostEntity>, req: IncomingMessage) {
    try {
      const createPost = await this.postRepository
        .createQueryBuilder('p')
        .where('p.post_id = :post_id', { post_id: data.post_id })
        .getOne();

      createPost.board_id = await this.boardRepository
        .createQueryBuilder('b')
        .where('b.board_id = :board_id', { board_id: data.board_id.board_id })
        .getOne();

      createPost.title = data.title;
      createPost.content = data.content;
      createPost.thumbnail = data.thumbnail ?? null;

      await this.postRepository.update(
        { post_id: createPost.post_id },
        createPost,
      );
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error, 500);
    }
  }

  async deletePost(id, req) {
    try {
      const post = await this.postRepository
        .createQueryBuilder('p')
        .where('p.post_id = :post_id', { post_id: id })
        .getOne();

      await this.postRepository.remove(post);
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error, 500);
    }
  }

  // 게시글 가져오기
  async getPost(id) {
    try {
      return await this.postRepository
        .createQueryBuilder('post')
        .where('post.post_id = :post_id', { post_id: id })
        .leftJoinAndSelect('post.user_id', 'user_id')
        .cache(true)
        .getOne();
    } catch (error) {
      this.logger.error(error);
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
