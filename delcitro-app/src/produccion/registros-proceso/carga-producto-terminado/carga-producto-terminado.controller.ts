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
import { CargaProductoTerminadoService } from './carga-producto-terminado.service';
import {
  CreateRegistroSalidaTransporteDto,
  CreateRevisionDocumentacionDto,
  CreateRevisionTransporteDto,
  UpdateRegistroSalidaTransporteDto,
  UpdateRevisionDocumentacionDto,
  UpdateRevisionTransporteDto,
} from 'src/produccion/models/dtos/index.dto';

@Controller('proceso/carga-producto-terminado')
export class CargaProductoTerminadoController {
  constructor(private regProdTerminadoService: CargaProductoTerminadoService) {}

  // ========== ENDPOINTS REGISTRO SALIDA TRANSPORTE ==========

  @Post('/crear/registro-salida')
  createRegistroSalida(@Body() data: CreateRegistroSalidaTransporteDto) {
    return this.regProdTerminadoService.createRegistroSalida(data);
  }

  @Get('/buscar/registro-salida')
  findAllRegistrosSalida() {
    return this.regProdTerminadoService.findAllRegistrosSalida();
  }

  @Get('/registro-salida/id/:id')
  findRegistroSalidaById(@Param('id', ParseIntPipe) id: number) {
    return this.regProdTerminadoService.findRegistroSalidaById(id);
  }

  @Get('/buscar/registro-salida/proceso/:id_proceso')
  findRegistroSalidaByIdProceso(@Param('id_proceso') id_proceso: string) {
    return this.regProdTerminadoService.findRegistroSalidaByIdProceso(id_proceso);
  }

  @Patch('/actualizar/registro-salida/:id')
  updateRegistroSalida(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRegistroSalidaTransporteDto: UpdateRegistroSalidaTransporteDto,
  ) {
    return this.regProdTerminadoService.updateRegistroSalida(id, updateRegistroSalidaTransporteDto);
  }

  @Delete('/eliminar/registro-salida/:id')
  removeRegistroSalida(@Param('id', ParseIntPipe) id: number) {
    return this.regProdTerminadoService.removeRegistroSalida(id);
  }

  // ========== ENDPOINTS REVISIÓN DOCUMENTACIÓN ==========

  @Post('/crear/revision-documentacion')
  createRevisionDocumentacion(@Body() data: CreateRevisionDocumentacionDto) {
    return this.regProdTerminadoService.createRevisionDocumentacion(data);
  }

  @Get('/buscar/revision-documentacion/:id')
  findRevisionDocumentacionById(@Param('id', ParseIntPipe) id: number) {
    return this.regProdTerminadoService.findRevisionDocumentacionById(id);
  }

  @Get('/revision-documentacion/registro/:registro_salida_id')
  findRevisionDocumentacionByRegistroSalida(
    @Param('registro_salida_id', ParseIntPipe) registro_salida_id: number,
  ) {
    return this.regProdTerminadoService.findRevisionDocumentacionByRegistroSalida(
      registro_salida_id,
    );
  }

  @Patch('/actualizar/revision-documentacion/:id')
  updateRevisionDocumentacion(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateRevisionDocumentacionDto,
  ) {
    return this.regProdTerminadoService.updateRevisionDocumentacion(id, data);
  }

  @Delete('/eliminar/revision-documentacion/:id')
  removeRevisionDocumentacion(@Param('id', ParseIntPipe) id: number) {
    return this.regProdTerminadoService.removeRevisionDocumentacion(id);
  }

  // ========== ENDPOINTS REVISIÓN TRANSPORTE ==========

  @Post('/crear/revision-transporte')
  createRevisionTransporte(@Body() data: CreateRevisionTransporteDto) {
    return this.regProdTerminadoService.createRevisionTransporte(data);
  }

  @Get('/revision-transporte/:id')
  findRevisionTransporteById(@Param('id', ParseIntPipe) id: number) {
    return this.regProdTerminadoService.findRevisionTransporteById(id);
  }

  @Get('/buscar/revision-transporte/registro/:registro_salida_id')
  findRevisionTransporteByRegistroSalida(
    @Param('registro_salida_id', ParseIntPipe) registro_salida_id: number,
  ) {
    return this.regProdTerminadoService.findRevisionTransporteByRegistroSalida(registro_salida_id);
  }

  @Patch('/actualizar/revision-transporte/:id')
  updateRevisionTransporte(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateRevisionTransporteDto,
  ) {
    return this.regProdTerminadoService.updateRevisionTransporte(id, data);
  }

  @Delete('/eliminar/revision-transporte/:id')
  removeRevisionTransporte(@Param('id', ParseIntPipe) id: number) {
    return this.regProdTerminadoService.removeRevisionTransporte(id);
  }

  // ========== ENDPOINTS DE ANÁLISIS ==========

  @Get('/calcular-tiempo-carga/:id_proceso')
  calcularTiempoCarga(@Param('id_proceso') id_proceso: string) {
    return this.regProdTerminadoService.calcularTiempoCarga(id_proceso);
  }

  @Get('/analizar-documentacion/:registro_salida_id')
  analizarDocumentacionCompleta(
    @Param('registro_salida_id', ParseIntPipe) registro_salida_id: number,
  ) {
    return this.regProdTerminadoService.analizarDocumentacionCompleta(registro_salida_id);
  }

  @Get('/analizar-transporte/:registro_salida_id')
  analizarCondicionTransporte(
    @Param('registro_salida_id', ParseIntPipe) registro_salida_id: number,
  ) {
    return this.regProdTerminadoService.analizarCondicionTransporte(registro_salida_id);
  }

  @Get('/calcular-eficiencia/:id_proceso')
  calcularEficienciaCargaCompleta(@Param('id_proceso') id_proceso: string) {
    return this.regProdTerminadoService.calcularEficienciaCargaCompleta(id_proceso);
  }

  @Get('/estadisticas')
  getEstadisticas() {
    return this.regProdTerminadoService.getEstadisticasCarga();
  }

  // ========== ENDPOINTS DE BÚSQUEDA ==========

  @Get('/buscar/placas-unidad/:placas')
  findByPlacasUnidad(@Param('placas') placas: string) {
    return this.regProdTerminadoService.findByPlacasUnidad(placas);
  }

  @Get('/buscar/placas-pipa/:placas')
  findByPlacasPipa(@Param('placas') placas: string) {
    return this.regProdTerminadoService.findByPlacasPipa(placas);
  }

  @Get('/buscar/linea-transporte/:linea')
  findByLineaTransporte(@Param('linea') linea: string) {
    return this.regProdTerminadoService.findByLineaTransporte(linea);
  }

  @Get('/buscar/chofer/:nombre_chofer')
  findByChofer(@Param('nombre_chofer') nombre_chofer: string) {
    return this.regProdTerminadoService.findByChofer(nombre_chofer);
  }

  @Get('/buscar/fecha')
  findByFechaRange(@Query('fechaInicio') fechaInicio: string, @Query('fechaFin') fechaFin: string) {
    return this.regProdTerminadoService.findByFechaRange(new Date(fechaInicio), new Date(fechaFin));
  }
}
