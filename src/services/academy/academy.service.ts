import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AcademyEntity } from './entities/academy.entity';
import { CreateAcademyDto } from './dto/academy.dto';

import { ClassEntity } from './entities/class.entity';

@Injectable()
export class AcademyService {
  constructor(
    @InjectRepository(AcademyEntity)
    private readonly academyRepository: Repository<AcademyEntity>,

    @InjectRepository(ClassEntity)
    private readonly classRepository: Repository<ClassEntity>,
  ) {}

  // 학원 생성
  async create(reqData: CreateAcademyDto) {
    try {
      const isExist = await this.academyRepository.findOneBy([
        {
          name: reqData.name,
          zip: reqData.zip,
        },
      ]);

      if (isExist === null) {
        const createAcademyDto = new CreateAcademyDto();
        createAcademyDto.name = reqData.name;
        createAcademyDto.president_name = reqData.president_name;
        createAcademyDto.phone = reqData.phone;
        createAcademyDto.address = reqData.address;
        createAcademyDto.zip = reqData.zip;
        createAcademyDto.address_detail = reqData.address_detail;

        await this.academyRepository.save(createAcademyDto);
        return `Create ${reqData.name} Academy`;
      } else {
        throw new UnauthorizedException('이미 존재하는 학원입니다.');
      }
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 500);
    }
  }

  // 학원 검색
  async search(str: string) {
    return;
  }
}
