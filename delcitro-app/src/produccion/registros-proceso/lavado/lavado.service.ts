import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  CreateVerificacionDetergenteDto,
  UpdateVerificacionDetergenteDto,
} from '../../../produccion/models/dtos/index.dto';

@Injectable()
export class LavadoService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateVerificacionDetergenteDto) {
    try {
      const procesoExiste = await this.prisma.rEGISTRO_PROCESO.findUnique({
        where: { id_proceso: data.id_proceso },
      });

      if (!procesoExiste) {
        throw new NotFoundException(`El proceso con id_proceso ${data.id_proceso} no existe`);
      }

      const countRegistros = await this.prisma.rEGISTRO_VERIFICACION_DETERGENTE.count({
        where: { id_proceso: data.id_proceso },
      });

      // El num_orden será el conteo actual + 1
      const num_orden = countRegistros + 1;

      return await this.prisma.rEGISTRO_VERIFICACION_DETERGENTE.create({
        data: {
          ...data,
          fecha: data.fecha || new Date(),
          hora: data.hora || new Date(),
          num_orden: num_orden,
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      throw new Error(`Error al crear el registro de verificación de detergente: ${error.message}`);
    }
  }

  async findAll() {
    try {
      return await this.prisma.rEGISTRO_VERIFICACION_DETERGENTE.findMany({
        include: {
          proceso: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      throw new Error(
        `Error al obtener los registros de verificación de detergente: ${error.message}`,
      );
    }
  }

  async findOne(id: number) {
    try {
      const verificacion = await this.prisma.rEGISTRO_VERIFICACION_DETERGENTE.findUnique({
        where: { id },
        include: {
          proceso: true,
        },
      });

      if (!verificacion) {
        throw new NotFoundException(
          `Registro de verificación de detergente con ID ${id} no encontrado`,
        );
      }

      return verificacion;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(
        `Error al obtener el registro de verificación de detergente: ${error.message}`,
      );
    }
  }

  async findByIdProceso(id_proceso: string) {
    try {
      const procesoExists = await this.prisma.rEGISTRO_PROCESO.findUnique({
        where: { id_proceso },
      });

      if (!procesoExists) {
        throw new NotFoundException(`El proceso con id_proceso ${id_proceso} no existe`);
      }

      const verificacion = await this.prisma.rEGISTRO_VERIFICACION_DETERGENTE.findFirst({
        where: { id_proceso: id_proceso },
        include: {
          proceso: true,
        },
      });

      if (!verificacion) {
        throw new NotFoundException(
          `Verificación de detergente para proceso ${id_proceso} no encontrada`,
        );
      }

      return verificacion;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(
        `Error al obtener el registro de verificación de detergente: ${error.message}`,
      );
    }
  }

  async update(id: number, data: UpdateVerificacionDetergenteDto) {
    try {
      await this.findOne(id);

      return await this.prisma.rEGISTRO_VERIFICACION_DETERGENTE.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(
        `Error al actualizar el registro de verificación de detergente: ${error.message}`,
      );
    }
  }

  async updateByIdProceso(id_proceso: string, data: UpdateVerificacionDetergenteDto) {
    try {
      const verificacion = await this.findByIdProceso(id_proceso);

      return await this.prisma.rEGISTRO_VERIFICACION_DETERGENTE.update({
        where: { id: verificacion.id },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(
        `Error al actualizar el registro de verificación de detergente: ${error.message}`,
      );
    }
  }

  async remove(id: number) {
    try {
      await this.findOne(id);

      return await this.prisma.rEGISTRO_VERIFICACION_DETERGENTE.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(
        `Error al eliminar el registro de verificación de detergente: ${error.message}`,
      );
    }
  }

  async removeByIdProceso(id_proceso: string) {
    try {
      const verificacion = await this.findByIdProceso(id_proceso);

      return await this.prisma.rEGISTRO_VERIFICACION_DETERGENTE.delete({
        where: { id: verificacion.id },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(
        `Error al eliminar el registro de verificación de detergente: ${error.message}`,
      );
    }
  }

  async calcularConcentracion(id_proceso: string) {
    try {
      const verificacion = await this.findByIdProceso(id_proceso);

      if (!verificacion.cant_agua || !verificacion.cantidad) {
        throw new BadRequestException(
          'No se puede calcular la concentración sin los datos de cantidad de agua y producto',
        );
      }

      const concentracionCalculada = (verificacion.cantidad / verificacion.cant_agua) * 100;

      const concentracionNormal = concentracionCalculada >= 0.5 && concentracionCalculada <= 2;

      return {
        id: verificacion.id,
        id_proceso: verificacion.id_proceso,
        cant_agua: verificacion.cant_agua,
        cantidad_producto: verificacion.cantidad,
        concentracion_calculada: Number(concentracionCalculada.toFixed(3)),
        concentracion_registrada: verificacion.concentracion,
        estado: concentracionNormal ? 'Dentro de parámetros' : 'Fuera de parámetros',
        rango_recomendado: '0.5% - 2%',
        diferencia: verificacion.concentracion ? 
          Number((concentracionCalculada - verificacion.concentracion).toFixed(3)) : null,
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(`Error al calcular la concentración: ${error.message}`);
    }
  }

  async verificarDilucion(id_proceso: string) {
    try {
      const verificacion = await this.findByIdProceso(id_proceso);

      if (!verificacion.resp_dilucion) {
        throw new BadRequestException('No hay respuesta de dilución registrada');
      }

      const dilucionAprobada =
        verificacion.resp_dilucion.toLowerCase().includes('correcta') ||
        verificacion.resp_dilucion.toLowerCase().includes('aprobada') ||
        verificacion.resp_dilucion.toLowerCase().includes('adecuada');

      return {
        id_proceso,
        resp_dilucion: verificacion.resp_dilucion,
        aprobada: dilucionAprobada,
        estado: dilucionAprobada ? 'Aprobada' : 'Revisar',
        producto: verificacion.producto,
        fecha_verificacion: verificacion.fecha,
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(`Error al verificar la dilución: ${error.message}`);
    }
  }

  async calcularEficienciaLavado(id_proceso: string) {
    try {
      const verificacion = await this.findByIdProceso(id_proceso);

      let puntuacion = 0;

      if (
        verificacion.concentracion &&
        verificacion.concentracion >= 0.5 &&
        verificacion.concentracion <= 2
      ) {
        puntuacion += 50;
      }

      if (verificacion.resp_dilucion) {
        const dilucionAprobada =
          verificacion.resp_dilucion.toLowerCase().includes('correcta') ||
          verificacion.resp_dilucion.toLowerCase().includes('aprobada');
        if (dilucionAprobada) {
          puntuacion += 50;
        }
      }

      return {
        id_proceso,
        producto: verificacion.producto,
        concentracion: verificacion.concentracion,
        resp_dilucion: verificacion.resp_dilucion,
        puntuacion_eficiencia: puntuacion,
        nivel_eficiencia: puntuacion >= 80 ? 'Alta' : puntuacion >= 60 ? 'Media' : 'Baja',
        recomendacion: puntuacion >= 80 ? 'Proceso óptimo' : 'Revisar parámetros',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Error al calcular la eficiencia de lavado: ${error.message}`);
    }
  }

  async findByFechaRange(fechaInicio: Date, fechaFin: Date) {
    try {
      const fechaFinAdjusted = new Date(fechaFin);
      fechaFinAdjusted.setHours(23, 59, 59, 999);

      return await this.prisma.rEGISTRO_VERIFICACION_DETERGENTE.findMany({
        where: {
          fecha: {
            gte: fechaInicio,
            lte: fechaFinAdjusted,
          },
        },
        include: {
          proceso: true,
        },
        orderBy: {
          fecha: 'desc',
        },
      });
    } catch (error) {
      throw new Error(`Error al obtener registros por rango de fecha: ${error.message}`);
    }
  }

  async findByProducto(producto: string) {
    try {
      return await this.prisma.rEGISTRO_VERIFICACION_DETERGENTE.findMany({
        where: {
          producto: {
            contains: producto,
            mode: 'insensitive',
          },
        },
        include: {
          proceso: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      throw new Error(`Error al obtener registros por producto: ${error.message}`);
    }
  }

  async findByTipoProceso(tipo_proceso: string) {
    try {
      return await this.prisma.rEGISTRO_VERIFICACION_DETERGENTE.findMany({
        where: {
          tipo_proceso: tipo_proceso as any,
        },
        include: {
          proceso: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      throw new Error(`Error al obtener registros por tipo de proceso: ${error.message}`);
    }
  }
}
