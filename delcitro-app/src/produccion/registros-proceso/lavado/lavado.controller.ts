import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { LavadoService } from './lavado.service';
import {
  CreateVerificacionDetergenteDto,
  UpdateVerificacionDetergenteDto,
} from 'src/produccion/models/dtos/index.dto';

@Controller('proceso/lavado')
export class LavadoController {
  constructor(private lavadoService: LavadoService) {}

  @Post('/crear')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() data: CreateVerificacionDetergenteDto) {
    return this.lavadoService.create(data);
  }

  @Get('/obtenerTodos')
  findAll() {
    return this.lavadoService.findAll();
  }

  @Get('/id-proceso/:id_proceso')
  findByIdProceso(@Param('id_proceso') id_proceso: string) {
    return this.lavadoService.findByIdProceso(id_proceso);
  }

  @Get('/calcular-concentracion/:id_proceso')
  calcularConcentracion(@Param('id_proceso') id_proceso: string) {
    return this.lavadoService.calcularConcentracion(id_proceso);
  }

  @Get('/verificar-dilucion/:id_proceso')
  verificarDilucion(@Param('id_proceso') id_proceso: string) {
    return this.lavadoService.verificarDilucion(id_proceso);
  }

  @Get('/calcular-eficiencia-lavado/:id_proceso')
  calcularEficienciaLavado(@Param('id_proceso') id_proceso: string) {
    return this.lavadoService.calcularEficienciaLavado(id_proceso);
  }

  @Get('/rango-fecha')
  findByFechaRange(@Query('fechaInicio') fechaInicio: string, @Query('fechaFin') fechaFin: string) {
    return this.lavadoService.findByFechaRange(new Date(fechaInicio), new Date(fechaFin));
  }

  @Get('/buscar-producto/:producto')
  findByProducto(@Param('producto') producto: string) {
    return this.lavadoService.findByProducto(producto);
  }

  @Get('/buscar/:tipo_proceso')
  findByTipoProceso(@Param('tipo_proceso') tipo_proceso: string) {
    return this.lavadoService.findByTipoProceso(tipo_proceso);
  }

  @Patch('/actualizar/:id_proceso')
  updateByIdProceso(
    @Param('id_proceso') id_proceso: string,
    @Body() data: UpdateVerificacionDetergenteDto,
  ) {
    return this.lavadoService.updateByIdProceso(id_proceso, data);
  }

  @Delete('/eliminar/:id_proceso')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeByIdProceso(@Param('id_proceso') id_proceso: string) {
    return this.lavadoService.removeByIdProceso(id_proceso);
  }
}
