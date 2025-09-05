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
  Patch,
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
  @Get('/find/:id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    console.log('Entrando a empleado por id');
    return this.empleadoService.findOne(id);
  }

  @Public()
  @Put('/editar/:id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    console.log(' 000000000000 ' + JSON.stringify(data));
    return this.empleadoService.update(id, data);
  }

  @Public()
  @Patch('/dar-baja/:id')
  @HttpCode(HttpStatus.OK)
  async darDeBaja(@Param('id', ParseIntPipe) id: number) {
    return this.empleadoService.darDeBaja(id);
  }

  @Public()
  @Patch('/reactivar/:id')
  @HttpCode(HttpStatus.OK)
  async reactivar(@Param('id', ParseIntPipe) id: number) {
    return this.empleadoService.reactivar(id);
  }

  @Public()
  @Get('/get-areas')
  @HttpCode(HttpStatus.OK)
  async getAreas() {
    return this.empleadoService.areas();
  }

  @Public()
  @Get('/get-departamentos')
  @HttpCode(HttpStatus.OK)
  async getDepartamentos() {
    return this.empleadoService.departamentos();
  }

  @Public()
  @Get('/get-puestos')
  @HttpCode(HttpStatus.OK)
  async getPuestos() {
    return this.empleadoService.puestos();
  }
}
