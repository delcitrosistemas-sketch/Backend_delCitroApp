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
import {
  CreateRegistroEntradaFrutaDto,
  UpdateRegistroEntradaFrutaDto,
} from '../../models/dtos/RegEntradaFruta.model';
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
  async create(@Body() data: CreateRegistroEntradaFrutaDto) {
    return this.service.create(data);
  }

  @Put('/editar/:id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateRegistroEntradaFrutaDto) {
    return this.service.update(id, data);
  }

  @Public()
  @Delete('/delete/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
