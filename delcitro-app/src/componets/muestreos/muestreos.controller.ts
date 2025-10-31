import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  HttpCode,
} from '@nestjs/common';
import { CreateMuestreoDto } from '../../componets/models/dtos/Muestreo.model';
import { Public } from '../../common/decorators';
import { MuestreosService } from './muestreos.service';

@Controller('muestreos')
export class MuestreosController {
  constructor(private readonly service: MuestreosService) {}

  @Public()
  @Get('/getAll')
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Public()
  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() registro: CreateMuestreoDto) {
    return this.service.create(registro);
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    return this.service.update(id, data);
  }

  @Public()
  @Delete('/delete/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
