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
import { RegEntraFrutaService } from './reg_entra_fruta.service';
import { CreateRegistroDto } from '../../../componets/models/index.model';
import { Public } from '../../../common/decorators';

@Controller('reg-entra-fruta')
export class RegEntraFrutaController {
  constructor(private readonly service: RegEntraFrutaService) {}

  @Public()
  @Get('/getAll')
  async findAll() {
    return this.service.findAll();
  }

  @Public()
  @Get('/get/:id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Public()
  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() registro: CreateRegistroDto) {
    return this.service.create(registro);
  }

  @Put('/editar/:id')
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
