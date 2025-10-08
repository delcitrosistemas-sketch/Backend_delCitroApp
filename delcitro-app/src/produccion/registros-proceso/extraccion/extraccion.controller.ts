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
} from '@nestjs/common';
import { ExtraccionService } from './extraccion.service';
import {
  CreateExtractoresFinisherDto,
  UpdateExtractoresFinisherDto,
} from 'src/produccion/models/dtos/index.dto';

@Controller('proceso/extraccion')
export class ExtraccionController {
  constructor(private extraccionService: ExtraccionService) {}

  @Post('/crear')
  create(@Body() data: CreateExtractoresFinisherDto) {
    return this.extraccionService.create(data);
  }

  @Get('/obtenerTodos')
  findAll() {
    return this.extraccionService.findAll();
  }

  @Get('/estadisticas')
  getEstadisticas() {
    return this.extraccionService.getEstadisticasExtractores();
  }

  @Get('/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.extraccionService.findOne(id);
  }

  @Get('/:id_proceso')
  findByIdProceso(@Param('id_proceso') id_proceso: string) {
    return this.extraccionService.findByIdProceso(id_proceso);
  }

  @Get('/:id_proceso/todos')
  findAllByIdProceso(@Param('id_proceso') id_proceso: string) {
    return this.extraccionService.findAllByIdProceso(id_proceso);
  }

  @Get('/fecha')
  findByFechaRange(@Query('fechaInicio') fechaInicio: string, @Query('fechaFin') fechaFin: string) {
    return this.extraccionService.findByFechaRange(new Date(fechaInicio), new Date(fechaFin));
  }

  @Get('/producto/:producto')
  findByProducto(@Param('producto') producto: string) {
    return this.extraccionService.findByProducto(producto);
  }

  @Get('/:tipo_proceso')
  findByTipoProceso(@Param('tipo_proceso') tipo_proceso: string) {
    return this.extraccionService.findByTipoProceso(tipo_proceso);
  }

  @Get('/calcular-eficiencia/:id_proceso')
  calcularEficiencia(@Param('id_proceso') id_proceso: string) {
    return this.extraccionService.calcularEficienciaExtraccion(id_proceso);
  }

  @Patch('/editar/:id')
  update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateExtractoresFinisherDto) {
    return this.extraccionService.update(id, data);
  }

  @Patch('/editar/:id_proceso')
  updateByIdProceso(
    @Param('id_proceso') id_proceso: string,
    @Body() data: UpdateExtractoresFinisherDto,
  ) {
    return this.extraccionService.updateByIdProceso(id_proceso, data);
  }

  @Delete('/eliminar/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.extraccionService.remove(id);
  }

  @Delete('/eliminar/:id_proceso')
  removeByIdProceso(@Param('id_proceso') id_proceso: string) {
    return this.extraccionService.removeByIdProceso(id_proceso);
  }
}
