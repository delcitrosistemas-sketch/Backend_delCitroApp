import { EmpleadosService } from './empleados.service';

import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Delete,

  ParseIntPipe,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Public } from '../../common/decorators/public.decorator';


@Controller('empleados')
export class EmpleadosController {
  constructor(private empleadoService: EmpleadosService) {}

  @Public()
  @Post('/crear-empleado')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() data: Prisma.EMPLEADOSCreateInput) {
    console.log(data);
    return this.empleadoService.create(data);
  }

  @Public()
  @Get('/get-all')
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return this.empleadoService.findAll();
  }

  @Public()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.empleadoService.findOne(id);
  }

  @Public()
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: Prisma.USUARIOSUpdateInput) {
    return this.empleadoService.update(id, data);
  }

  @Public()
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.empleadoService.remove(id);
  }
}
