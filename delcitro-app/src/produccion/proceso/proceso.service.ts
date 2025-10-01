import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaProcesoService } from 'src/prisma/proceso/prisma.proceso.service';
import { CreateRegistroProcesoDto, UpdateRegistroProcesoDto } from '../models/dtos/proceso.dto';

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
      console.log('Folio en registro proceso: ' + folio);

      // Verificar si el id_proceso ya existe
      const existing = await this.prisma.rEGISTRO_PROCESO.findUnique({
        where: { id_proceso: folio },
      });

      if (existing) {
        throw new ConflictException(`El id_proceso ${folio} ya existe`);
      }

      // Usar transacción para crear todos los registros relacionados
      return await this.prisma.$transaction(async (tx) => {
        // 1. Crear el registro principal
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

        // 2. Crear registros vacíos en todas las tablas relacionadas
        const descargaFruta = await tx.rEGISTRO_DESCARGA_FRUTA.create({
          data: {
            id_proceso: folio,
            folio_fruta: `${folio}-DESCARGA`,
            fecha: new Date(),
            placas_transporte: '',
            variedad: data.variedad,
            destino: data.destino,
            tipo_proceso: data.tipo_proceso,
          },
        });

        const reporteMerma = await tx.rEGISTRO_MERMA.create({
          data: {
            id_proceso: folio,
            folio_fruta: `${folio}-MERMA`,
            fecha: new Date(),
            placas_transporte: '',
            variedad: data.variedad,
            destino: data.destino,
            tipo_proceso: data.tipo_proceso,
          },
        });

        const verificacionDetergente = await tx.rEGISTRO_VERIFICACION_DETERGENTE.create({
          data: {
            id_proceso: folio,
            folio_fruta: `${folio}-DETERGENTE`,
            fecha: new Date(),
            tipo_proceso: data.tipo_proceso,
            hora: new Date(),
            cant_agua: 0,
            producto: '',
            cantidad: 0,
            concentracion: 0,
            resp_dilucion: '',
          },
        });

        const extractoresFinisher = await tx.rEGISTRO_EXTRACTORES_FINISHER.create({
          data: {
            id_proceso: folio,
            folio_fruta: `${folio}-EXTRACTORES`,
            fecha: new Date(),
            producto: '',
            tipo_proceso: data.tipo_proceso,
            num_extractor: 0,
            modelo: 0,
            medida_extractor: 0,
            hora: new Date(),
            cap_ext: 0,
            presion: 0,
            ajuste_micro: '',
            valor_extraccion: '',
            observaciones: '',
            psi_finisher_primario: '',
          },
        });

        const refrigeracionPasteurizacion = await tx.rEGISTRO_REFRIGERACION_PASTEURIZACION.create({
          data: {
            id_proceso: folio,
            folio_fruta: '',
            fecha: new Date(),
            producto: '',
            tipo_proceso: data.tipo_proceso,
            secuencia: 0,
            tpf: 0,
            volumen: 0,
            inicio_envio: new Date(),
            temp_inicio: 0,
            temp_medio: 0,
            temp_fin: 0,
            operador: '',
          },
        });

        const salidaTransporte = await tx.rEGISTRO_SALIDA_TRANSPORTE.create({
          data: {
            id_proceso: folio,
            fecha_realizo: new Date(),
            num_placas_unidad: '',
            num_placas_pipa: '',
            linea_transporte: '',
            firma_chofer: '',
            nombre_chofer: '',
            nombre_realizo: '',
            firma_realizo: '',
          },
        });

        // Retornar el registro principal con todas las relaciones creadas
        return {
          ...registroPrincipal,
          descarga_fruta: descargaFruta,
          reporte_merma: reporteMerma,
          verificacion_detergente: verificacionDetergente,
          extractores_finisher: extractoresFinisher,
          refrigeracion_pasteurizacion: refrigeracionPasteurizacion,
          salida_transporte: salidaTransporte,
        };
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
