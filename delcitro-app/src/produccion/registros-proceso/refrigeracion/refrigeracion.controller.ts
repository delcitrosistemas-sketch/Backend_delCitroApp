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
import { RefrigeracionService } from './refrigeracion.service';
import {
  CreateRefrigeracionPasteurizacionDto,
  UpdateRefrigeracionPasteurizacionDto,
} from 'src/produccion/models/dtos/index.dto';

@Controller('proceso/refrigeracion')
export class RefrigeracionController {
  constructor(private refrigeracionService: RefrigeracionService) {}

  @Post('/crear')
  create(@Body() data: any) {
    return this.refrigeracionService.create(data);
  }

  @Post('/multiple')
  async createMultiple(@Body() data: CreateRefrigeracionPasteurizacionDto) {
    return this.refrigeracionService.createMultiple(data);
  }

  @Get('/obtenerTodos')
  findAll() {
    return this.refrigeracionService.findAll();
  }

  @Get('/estadisticas')
  getEstadisticas() {
    return this.refrigeracionService.getEstadisticasRefrigeracion();
  }

  @Get('/buscar/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.refrigeracionService.findOne(id);
  }

  @Get('/folio/:folio_fruta')
  findByFolioFruta(@Param('folio_fruta') folio_fruta: string) {
    return this.refrigeracionService.findByFolioFruta(folio_fruta);
  }

  @Get('proceso/:id_proceso')
  findByIdProceso(@Param('id_proceso') id_proceso: string) {
    return this.refrigeracionService.findByIdProceso(id_proceso);
  }

  @Get('/:id_proceso')
  findAllByIdProceso(@Param('id_proceso') id_proceso: string) {
    return this.refrigeracionService.findAllByIdProceso(id_proceso);
  }

  @Get('/secuencia/:secuencia')
  findBySecuencia(@Param('secuencia', ParseIntPipe) secuencia: number) {
    return this.refrigeracionService.findBySecuencia(secuencia);
  }

  @Get('/fecha')
  findByFechaRange(@Query('fechaInicio') fechaInicio: string, @Query('fechaFin') fechaFin: string) {
    return this.refrigeracionService.findByFechaRange(new Date(fechaInicio), new Date(fechaFin));
  }

  @Get('/producto/:producto')
  findByProducto(@Param('producto') producto: string) {
    return this.refrigeracionService.findByProducto(producto);
  }

  @Get('/tipo-proceso/:tipo_proceso')
  findByTipoProceso(@Param('tipo_proceso') tipo_proceso: string) {
    return this.refrigeracionService.findByTipoProceso(tipo_proceso);
  }

  @Get('/calcular-tiempo-envio/:id_proceso')
  calcularTiempoEnvio(@Param('id_proceso') id_proceso: string) {
    return this.refrigeracionService.calcularTiempoEnvio(id_proceso);
  }

  @Get('/analizar-temperaturas/:id_proceso')
  analizarTemperaturas(@Param('id_proceso') id_proceso: string) {
    return this.refrigeracionService.analizarTemperaturas(id_proceso);
  }

  @Get('/calcular-eficiencia/:id_proceso')
  calcularEficiencia(@Param('id_proceso') id_proceso: string) {
    return this.refrigeracionService.calcularEficienciaProceso(id_proceso);
  }

  @Patch('/actualizar/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRefrigeracionPasteurizacionDto: UpdateRefrigeracionPasteurizacionDto,
  ) {
    return this.refrigeracionService.update(id, updateRefrigeracionPasteurizacionDto);
  }

  @Patch('/editarFolio/:folio_fruta')
  updateByFolioFruta(
    @Param('folio_fruta') folio_fruta: string,
    @Body() updateRefrigeracionPasteurizacionDto: UpdateRefrigeracionPasteurizacionDto,
  ) {
    return this.refrigeracionService.updateByFolioFruta(
      folio_fruta,
      updateRefrigeracionPasteurizacionDto,
    );
  }

  @Patch('/actualizar/:id_proceso')
  updateByIdProceso(
    @Param('id_proceso') id_proceso: string,
    @Body() updateRefrigeracionPasteurizacionDto: UpdateRefrigeracionPasteurizacionDto,
  ) {
    return this.refrigeracionService.updateByIdProceso(
      id_proceso,
      updateRefrigeracionPasteurizacionDto,
    );
  }

  @Delete('/eliminar/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.refrigeracionService.remove(id);
  }

  @Delete('/eliminarPorFolio/:folio_fruta')
  removeByFolioFruta(@Param('folio_fruta') folio_fruta: string) {
    return this.refrigeracionService.removeByFolioFruta(folio_fruta);
  }

  @Delete('/eliminar/:id_proceso')
  removeByIdProceso(@Param('id_proceso') id_proceso: string) {
    return this.refrigeracionService.removeByIdProceso(id_proceso);
  }
}
