import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { SeleccionService } from './seleccion.service';
import {
  CreateReporteMermaDto,
  UpdateReporteMermaDto,
} from '../../../produccion/models/dtos/index.dto';

@Controller('proceso/seleccion')
export class SeleccionController {
  constructor(private seleccionService: SeleccionService) {}

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() data: CreateReporteMermaDto) {
    return this.seleccionService.create(data);
  }

  @Get('/obtenerTodos')
  findAll() {
    return this.seleccionService.findAll();
  }

  @Get('/id-proceso/:id_proceso')
  findByIdProceso(@Param('id_proceso') id_proceso: string) {
    return this.seleccionService.findByIdProceso(id_proceso);
  }

  @Get('/calcular-merma/:id_proceso')
  calcularMerma(@Param('id_proceso') id_proceso: string) {
    return this.seleccionService.calcularMerma(id_proceso);
  }

  @Get('/rango-fecha')
  findByFechaRange(@Query('fechaInicio') fechaInicio: string, @Query('fechaFin') fechaFin: string) {
    return this.seleccionService.findByFechaRange(new Date(fechaInicio), new Date(fechaFin));
  }

  @Get('/variedad/:variedad')
  findByVariedad(@Param('variedad') variedad: string) {
    return this.seleccionService.findByVariedad(variedad);
  }

  @Patch('/actualizar/:id_proceso')
  updateByIdProceso(@Param('id_proceso') id_proceso: string, @Body() data: UpdateReporteMermaDto) {
    return this.seleccionService.updateByIdProceso(id_proceso, data);
  }

  @Delete('/eliminar/:id_proceso')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeByIdProceso(@Param('id_proceso') id_proceso: string) {
    return this.seleccionService.removeByIdProceso(id_proceso);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.seleccionService.remove(id);
  }
}
