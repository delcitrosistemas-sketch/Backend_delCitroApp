import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaProcesoService } from 'src/prisma/proceso/prisma.proceso.service';
import { CreateRegistroProcesoDto, UpdateRegistroProcesoDto } from '../models/dtos/index.dto';

import { TipoProceso } from '.prisma/client-proceso';
import { FoliosService } from 'src/shared/folios/folios.service';

@Injectable()
export class ProcesoService {
  constructor(
    private prisma: PrismaProcesoService,
    private folioService: FoliosService,
  ) {}

  async create(data: CreateRegistroProcesoDto) {
    try {
      const folio = await this.folioService.generarCodigoProceso();

      let isOrganic = false;
      if (data.tipo_proceso === 'Organico') {
        isOrganic = true;
      }

      const folioFruta = await this.folioService.generarFolioRecepcionFruta(
        data.variedad,
        isOrganic,
      );

      const existe = await this.prisma.rEGISTRO_PROCESO.findUnique({
        where: { id_proceso: folio },
      });

      if (existe) {
        throw new ConflictException(`El id_proceso ${folio} ya existe`);
      }

      return await this.prisma.$transaction(async (tx) => {
        const registroPrincipal = await tx.rEGISTRO_PROCESO.create({
          data: {
            id_proceso: folio,
            tipo_proceso: data.tipo_proceso,
            variedad: data.variedad,
            destino: data.destino,
            lote_asignado: data.lote_asignado,
            fecha: new Date(),
          },
        });

        return registroPrincipal;
      });
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new Error(`Error al crear el registro de proceso: ${error.message}`);
    }
  }

  async findAll() {
    try {
      return await this.prisma.rEGISTRO_PROCESO.findMany({
        include: {
          descarga_fruta: true,
          reporte_merma: true,
          verificacion_detergente: true,
          extractores_finisher: true,
          refrigeracion_pasteurizacion: true,
          salida_transporte: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      throw new Error(`Error al obtener los registros de proceso: ${error.message}`);
    }
  }

  async findOne(id: number) {
    try {
      const registro = await this.prisma.rEGISTRO_PROCESO.findUnique({
        where: { id },
        include: {
          descarga_fruta: true,
          reporte_merma: true,
          verificacion_detergente: true,
          extractores_finisher: true,
          refrigeracion_pasteurizacion: true,
          salida_transporte: {
            include: {
              revision_documentacion: true,
              revision_transporte: true,
            },
          },
        },
      });

      if (!registro) {
        throw new NotFoundException(`Registro de proceso con ID ${id} no encontrado`);
      }

      return registro;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Error al obtener el registro de proceso: ${error.message}`);
    }
  }

  async findByIdProceso(id_proceso: string) {
    try {
      const registro = await this.prisma.rEGISTRO_PROCESO.findUnique({
        where: { id_proceso },
        include: {
          descarga_fruta: true,
          reporte_merma: true,
          verificacion_detergente: true,
          extractores_finisher: true,
          refrigeracion_pasteurizacion: true,
          salida_transporte: {
            include: {
              revision_documentacion: true,
              revision_transporte: true,
            },
          },
        },
      });

      if (!registro) {
        throw new NotFoundException(
          `Registro de proceso con id_proceso ${id_proceso} no encontrado`,
        );
      }

      return registro;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Error al obtener el registro de proceso: ${error.message}`);
    }
  }

  async updateByIdProceso(id_proceso: string, data: UpdateRegistroProcesoDto) {
    try {
      await this.findByIdProceso(id_proceso);

      return await this.prisma.rEGISTRO_PROCESO.update({
        where: { id_proceso },
        data: data,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Error al actualizar el registro de proceso: ${error.message}`);
    }
  }

  async remove(id: number) {
    try {
      await this.findOne(id);

      return await this.prisma.rEGISTRO_PROCESO.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Error al eliminar el registro de proceso: ${error.message}`);
    }
  }

  async removeByIdProceso(id_proceso: string) {
    try {
      await this.findByIdProceso(id_proceso);

      return await this.prisma.rEGISTRO_PROCESO.delete({
        where: { id_proceso },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Error al eliminar el registro de proceso: ${error.message}`);
    }
  }

  async findByTipoProceso(tipo_proceso: TipoProceso) {
    try {
      return await this.prisma.rEGISTRO_PROCESO.findMany({
        where: { tipo_proceso },
        include: {
          descarga_fruta: true,
          reporte_merma: true,
          verificacion_detergente: true,
          extractores_finisher: true,
          refrigeracion_pasteurizacion: true,
          salida_transporte: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      throw new Error(`Error al obtener registros por tipo de proceso: ${error.message}`);
    }
  }

  async findByVariedad(variedad: string) {
    try {
      return await this.prisma.rEGISTRO_PROCESO.findMany({
        where: {
          variedad: {
            contains: variedad,
            mode: 'insensitive',
          },
        },
        include: {
          descarga_fruta: true,
          reporte_merma: true,
          verificacion_detergente: true,
          extractores_finisher: true,
          refrigeracion_pasteurizacion: true,
          salida_transporte: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      throw new Error(`Error al obtener registros por variedad: ${error.message}`);
    }
  }

  async findByFechaRange(fechaInicio: Date, fechaFin: Date) {
    try {
      const fechaFinAdjusted = new Date(fechaFin);
      fechaFinAdjusted.setHours(23, 59, 59, 999);

      return await this.prisma.rEGISTRO_PROCESO.findMany({
        where: {
          fecha: {
            gte: fechaInicio,
            lte: fechaFinAdjusted,
          },
        },
        include: {
          descarga_fruta: true,
          reporte_merma: true,
          verificacion_detergente: true,
          extractores_finisher: true,
          refrigeracion_pasteurizacion: true,
          salida_transporte: true,
        },
        orderBy: {
          fecha: 'desc',
        },
      });
    } catch (error) {
      throw new Error(`Error al obtener registros por rango de fecha: ${error.message}`);
    }
  }
}
