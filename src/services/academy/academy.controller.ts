import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../user/jwt/jwt.guard';
import { AcademyService } from './academy.service';
import { CreateAcademyDto } from './dto/academy.dto';

@Controller('academy')
export class AcademyController {
  constructor(private readonly academyService: AcademyService) {}

  // 학원 생성
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Body() reqData: CreateAcademyDto) {
    return await this.academyService.create(reqData);
  }

  @Get('search/:str')
  async search(@Param('str') str: string) {
    return await this.academyService.search(str);
  }
}
