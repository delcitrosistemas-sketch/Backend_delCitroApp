import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  CreateReporteMermaDto,
  UpdateReporteMermaDto,
} from '../../../produccion/models/dtos/index.dto';

@Injectable()
export class SeleccionService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateReporteMermaDto) {
    try {
      const procesoExiste = await this.prisma.rEGISTRO_PROCESO.findUnique({
        where: { id_proceso: data.id_proceso },
      });

      if (!procesoExiste) {
        throw new NotFoundException(`El proceso con id_proceso ${data.id_proceso} no existe`);
      }
      const countRegistros = await this.prisma.rEGISTRO_MERMA.count({
        where: { id_proceso: data.id_proceso },
      });

      const num_orden = countRegistros + 1;

      return await this.prisma.rEGISTRO_MERMA.create({
        data: {
          ...data,
          area: 'Seleccion',
          fecha: data.fecha || new Date(),
          num_orden: num_orden,
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      throw new Error(`Error al crear el reporte de merma: ${error.message}`);
    }
  }

  async findAll() {
    try {
      return await this.prisma.rEGISTRO_MERMA.findMany({
        include: {
          proceso: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      throw new Error(`Error al obtener los reportes de merma: ${error.message}`);
    }
  }

  async findOne(id: number) {
    try {
      const reporte = await this.prisma.rEGISTRO_MERMA.findUnique({
        where: { id },
        include: {
          proceso: true,
        },
      });

      if (!reporte) {
        throw new NotFoundException(`Reporte de merma con ID ${id} no encontrado`);
      }

      return reporte;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Error al obtener el reporte de merma: ${error.message}`);
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

      // Cambiar de findUnique a findFirst
      const merma = await this.prisma.rEGISTRO_MERMA.findFirst({
        where: {
          id_proceso: id_proceso,
        },
        include: {
          proceso: true,
        },
      });

      if (!merma) {
        throw new NotFoundException(`Merma para proceso ${id_proceso} no encontrada`);
      }

      return merma;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Error al obtener el reporte de merma: ${error.message}`);
    }
  }

  async update(id: number, data: UpdateReporteMermaDto) {
    try {
      await this.findOne(id);

      return await this.prisma.rEGISTRO_MERMA.update({
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
      throw new Error(`Error al actualizar el reporte de merma: ${error.message}`);
    }
  }

  async findAllByIdProceso(id_proceso: string) {
    try {
      const procesoExists = await this.prisma.rEGISTRO_PROCESO.findUnique({
        where: { id_proceso },
      });

      if (!procesoExists) {
        throw new NotFoundException(`El proceso con id_proceso ${id_proceso} no existe`);
      }

      const mermas = await this.prisma.rEGISTRO_MERMA.findMany({
        where: {
          id_proceso: id_proceso,
        },
        include: {
          proceso: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return mermas;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Error al obtener los registros de merma: ${error.message}`);
    }
  }

  // Actualizar los métodos que usan id_proceso para usar el id numérico
  async updateByIdProceso(id_proceso: string, data: UpdateReporteMermaDto) {
    try {
      const merma = await this.findByIdProceso(id_proceso);

      return await this.prisma.rEGISTRO_MERMA.update({
        where: { id: merma.id },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Error al actualizar el registro de merma: ${error.message}`);
    }
  }
  async remove(id: number) {
    try {
      await this.findOne(id);

      return await this.prisma.rEGISTRO_MERMA.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Error al eliminar el reporte de merma: ${error.message}`);
    }
  }

  async removeByIdProceso(id_proceso: string) {
    try {
      const verificacion = await this.findByIdProceso(id_proceso);

      return await this.prisma.rEGISTRO_MERMA.delete({
        where: { id: verificacion.id },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Error al eliminar el reporte de merma: ${error.message}`);
    }
  }

  async calcularMerma(id_proceso: string) {
    try {
      const reporte = await this.findByIdProceso(id_proceso);

      if (!reporte.cant_progra_desca || !reporte.peso_neto) {
        throw new BadRequestException(
          'No se puede calcular la merma sin los datos de cantidad programada y real',
        );
      }

      const merma = reporte.cant_progra_desca - reporte.peso_neto;
      const porcentajeMerma = (merma / reporte.cant_progra_desca) * 100;
      const pesoNeto = Number(reporte.peso_neto);

      return {
        id_proceso,
        cant_programada: reporte.cant_progra_desca,
        peso_neto: pesoNeto,
        merma_absoluta: merma,
        porcentaje_merma: Number(porcentajeMerma.toFixed(2)),
        fecha_calculo: new Date(),
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(`Error al calcular la merma: ${error.message}`);
    }
  }

  async findByFechaRange(fechaInicio: Date, fechaFin: Date) {
    try {
      const fechaFinAdjusted = new Date(fechaFin);
      fechaFinAdjusted.setHours(23, 59, 59, 999);

      return await this.prisma.rEGISTRO_MERMA.findMany({
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
      throw new Error(`Error al obtener reportes por rango de fecha: ${error.message}`);
    }
  }

  async findByVariedad(variedad: string) {
    try {
      return await this.prisma.rEGISTRO_MERMA.findMany({
        where: {
          variedad: {
            contains: variedad,
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
      throw new Error(`Error al obtener reportes por variedad: ${error.message}`);
    }
  }
}
