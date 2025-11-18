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
import {
  CreateDescargaFrutaDto,
  UpdateDescargaFrutaDto,
} from '../../../produccion/models/dtos/index.dto';
import { DescargaService } from './descarga.service';

@Controller('proceso/descarga')
export class DescargaController {
  constructor(private descargaFrutaService: DescargaService) {}
  @Get('/obtenerTodos')
  findAll() {
    return this.descargaFrutaService.findAll();
  }

  @Post('/crear')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() data: CreateDescargaFrutaDto) {
    return this.descargaFrutaService.create(data);
  }

  @Get('/:id_proceso')
  findByIdProceso(@Param('id_proceso') id_proceso: string) {
    return this.descargaFrutaService.findByIdProceso(id_proceso);
  }

  @Get('/calcular-tiempo-descarga/:id_proceso')
  calcularTiempoDescarga(@Param('id_proceso') id_proceso: string) {
    return this.descargaFrutaService.calcularTiempoDescarga(id_proceso);
  }

  @Get('/calcular-eficiencia/:id_proceso')
  calcularEficiencia(@Param('id_proceso') id_proceso: string) {
    return this.descargaFrutaService.calcularEficienciaDescarga(id_proceso);
  }

  @Get('calcular-eficiencia-individual/:id')
  calcularEficienciaIndividual(@Param('id', ParseIntPipe) id: number) {
    return this.descargaFrutaService.calcularEficienciaDescargaIndividual(id);
  }

  @Get('/rango-fecha')
  findByFechaRange(@Query('fechaInicio') fechaInicio: string, @Query('fechaFin') fechaFin: string) {
    return this.descargaFrutaService.findByFechaRange(new Date(fechaInicio), new Date(fechaFin));
  }

  @Get('/variedad/:variedad')
  findByVariedad(@Param('variedad') variedad: string) {
    return this.descargaFrutaService.findByVariedad(variedad);
  }

  @Get('/placas/:placas')
  findByPlacasTransporte(@Param('placas') placas: string) {
    return this.descargaFrutaService.findByPlacasTransporte(placas);
  }

  @Get('/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.descargaFrutaService.findOne(id);
  }

  @Patch('/actualizar/:id_proceso')
  updateByIdProceso(@Param('id_proceso') id_proceso: string, @Body() data: UpdateDescargaFrutaDto) {
    return this.descargaFrutaService.updateByIdProceso(id_proceso, data);
  }

  @Delete('/eliminar/:id_proceso')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeByIdProceso(@Param('id_proceso') id_proceso: string) {
    return this.descargaFrutaService.removeByIdProceso(id_proceso);
  }
}
