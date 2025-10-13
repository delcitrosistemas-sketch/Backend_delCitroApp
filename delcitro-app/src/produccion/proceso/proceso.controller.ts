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
import { ProcesoService } from './proceso.service';
import { TipoProceso } from '.prisma/client-proceso';
import { CreateRegistroProcesoDto, UpdateRegistroProcesoDto } from '../models/dtos/proceso.dto';
import { EstadisticasProcesoService } from './proceso.estadisticas.service';

@Controller('proceso')
export class ProcesoController {
  constructor(
    private readonly registroProcesoService: ProcesoService,
    private estadisticasService: EstadisticasProcesoService,
  ) {}

  @Post('/crear')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() data: CreateRegistroProcesoDto) {
    return this.registroProcesoService.create(data);
  }

  @Get('/contador')
  contadorProcesos() {
    return this.registroProcesoService.contarProcesos();
  }

  @Get('/status/:status')
  getByStatus(@Param('status') data: string) {
    return this.registroProcesoService.findByStatus(data);
  }

  @Get('/obtener-todos')
  findAll() {
    return this.registroProcesoService.findAll();
  }

  @Get('/tipo-proceso/:tipo_proceso')
  findByTipoProceso(@Param('tipo_proceso') tipo_proceso: TipoProceso) {
    return this.registroProcesoService.findByTipoProceso(tipo_proceso);
  }

  @Get('/variedad/:variedad')
  findByVariedad(@Param('variedad') variedad: string) {
    return this.registroProcesoService.findByVariedad(variedad);
  }

  @Get('/en-proceso/ids')
  getIdProcesosEnProceso() {
    return this.registroProcesoService.getFoliosEnProceso();
  }

  @Get('/rango-fecha')
  findByFechaRange(@Query('fechaInicio') fechaInicio: string, @Query('fechaFin') fechaFin: string) {
    return this.registroProcesoService.findByFechaRange(new Date(fechaInicio), new Date(fechaFin));
  }

  @Get('/id-proceso/:id_proceso')
  findByIdProceso(@Param('id_proceso') id_proceso: string) {
    return this.registroProcesoService.findByIdProceso(id_proceso);
  }

  @Get('/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.registroProcesoService.findOne(id);
  }

  @Patch('/id-proceso/:id_proceso')
  updateByIdProceso(
    @Param('id_proceso') id_proceso: string,
    @Body() data: UpdateRegistroProcesoDto,
  ) {
    return this.registroProcesoService.updateByIdProceso(id_proceso, data);
  }

  @Delete('/id-proceso/:id_proceso')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeByIdProceso(@Param('id_proceso') id_proceso: string) {
    return this.registroProcesoService.removeByIdProceso(id_proceso);
  }

  // ======= Estadísticas Proceso =========
  @Get('/estadisticas/completas')
  getEstadisticasCompletasProceso() {
    return this.estadisticasService.getEstadisticasCompletas();
  }

  @Get('/estadisticas/mensual')
  getEstadisticasPorMes() {
    return this.estadisticasService.getEstadisticasMensuales();
  }

  @Get('/estadisticas/diario')
  getEstadisticasDiarias() {
    return this.estadisticasService.getEstadisticasDiarias();
  }

  @Get('/estadisticas/anual')
  getEstadisticasAnuales() {
    return this.estadisticasService.getEstadisticasAnuales();
  }
  @Get('/estadisticas/anual-mes')
  getEstadisticasAnualesPorMes() {
    return this.estadisticasService.getEstadisticasMensualAnual();
  }

  @Get('/estadisticas/tipo-proceso')
  getEstadisticasPorTipo() {
    return this.estadisticasService.getEstadisticasPorTipoProceso();
  }

  @Get('/estadisticas/variedad')
  getEstadisticasPorVariedad() {
    return this.estadisticasService.getEstadisticasPorVariedad();
  }

  @Get('/estadisticas/status')
  getEstadisticasPorStatus() {
    return this.estadisticasService.getEstadisticasPorStatus();
  }

  @Get('/estadisticas/hoy')
  getTotalProcesosHoy() {
    return this.estadisticasService.getTotalProcesosHoy();
  }
}
