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

@Controller('proceso')
export class ProcesoController {
  constructor(private readonly registroProcesoService: ProcesoService) {}

  @Post('/crear')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() data: CreateRegistroProcesoDto) {
    return this.registroProcesoService.create(data);
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
}
