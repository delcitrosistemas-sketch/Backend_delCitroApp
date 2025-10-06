import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaProcesoService } from 'src/prisma/proceso/prisma.proceso.service';
import {
  CreateDescargaFrutaDto,
  UpdateDescargaFrutaDto,
} from 'src/produccion/models/dtos/index.dto';

@Injectable()
export class DescargaService {
  constructor(private prisma: PrismaProcesoService) {}

  async create(data: CreateDescargaFrutaDto) {
    try {
      const procesoExiste = await this.prisma.rEGISTRO_PROCESO.findUnique({
        where: { id_proceso: data.id_proceso },
      });

      if (!procesoExiste) {
        throw new NotFoundException(`El proceso con id_proceso ${data.id_proceso} no existe`);
      }

      return await this.prisma.rEGISTRO_DESCARGA_FRUTA.create({
        data: {
          ...data,
          fecha: data.fecha || new Date(),
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      throw new Error(`Error al crear el registro de descarga de fruta: ${error.message}`);
    }
  }

  async findAll() {
    try {
      return await this.prisma.rEGISTRO_DESCARGA_FRUTA.findMany({
        include: {
          proceso: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      throw new Error(`Error al obtener los registros de descarga de fruta: ${error.message}`);
    }
  }

  async findOne(id: number) {
    try {
      const descarga = await this.prisma.rEGISTRO_DESCARGA_FRUTA.findUnique({
        where: { id },
        include: {
          proceso: true,
        },
      });

      if (!descarga) {
        throw new NotFoundException(`Registro de descarga de fruta con ID ${id} no encontrado`);
      }

      return descarga;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Error al obtener el registro de descarga de fruta: ${error.message}`);
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

      const descarga = await this.prisma.rEGISTRO_DESCARGA_FRUTA.findFirst({
        where: {
          id_proceso: id_proceso,
        },
        include: {
          proceso: true,
        },
      });

      if (!descarga) {
        throw new NotFoundException(`Descarga de fruta para proceso ${id_proceso} no encontrada`);
      }

      return descarga;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Error al obtener el registro de descarga de fruta: ${error.message}`);
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

      const descargas = await this.prisma.rEGISTRO_DESCARGA_FRUTA.findMany({
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

      return descargas;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Error al obtener los registros de descarga de fruta: ${error.message}`);
    }
  }

  async update(id: number, data: UpdateDescargaFrutaDto) {
    try {
      await this.findOne(id);

      return await this.prisma.rEGISTRO_DESCARGA_FRUTA.update({
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
      throw new Error(`Error al actualizar el registro de descarga de fruta: ${error.message}`);
    }
  }

  async updateByIdProceso(id_proceso: string, data: UpdateDescargaFrutaDto) {
    try {
      const verificacion = await this.findByIdProceso(id_proceso);

      return await this.prisma.rEGISTRO_DESCARGA_FRUTA.update({
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
      throw new Error(`Error al actualizar el registro de descarga de fruta: ${error.message}`);
    }
  }

  async remove(id: number) {
    try {
      await this.findOne(id);

      return await this.prisma.rEGISTRO_DESCARGA_FRUTA.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Error al eliminar el registro de descarga de fruta: ${error.message}`);
    }
  }

  async removeByIdProceso(id_proceso: string) {
    try {
      const verificacion = await this.findByIdProceso(id_proceso);

      return await this.prisma.rEGISTRO_DESCARGA_FRUTA.delete({
        where: { id: verificacion.id },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Error al eliminar el registro de descarga de fruta: ${error.message}`);
    }
  }

  async calcularTiempoDescarga(id_proceso: string) {
    try {
      const descargas = await this.findAllByIdProceso(id_proceso);

      if (descargas.length === 0) {
        throw new NotFoundException(`No hay registros de descarga para el proceso ${id_proceso}`);
      }

      let totalProgramado = 0;
      let totalReal = 0;
      let count = 0;

      descargas.forEach((descarga) => {
        if (descarga.cant_progra_desca && descarga.cant_real_desca) {
          totalProgramado += descarga.cant_progra_desca;
          totalReal += descarga.cant_real_desca;
          count++;
        }
      });

      if (count === 0) {
        throw new BadRequestException(
          'No se puede calcular la eficiencia sin datos de cantidad programada y real',
        );
      }

      const promedioProgramado = totalProgramado / count;
      const promedioReal = totalReal / count;
      const eficiencia = (promedioReal / promedioProgramado) * 100;
      const diferencia = promedioReal - promedioProgramado;

      return {
        id_proceso,
        total_descargas: descargas.length,
        descargas_con_datos: count,
        cant_programada_promedio: Number(promedioProgramado.toFixed(2)),
        cant_real_promedio: Number(promedioReal.toFixed(2)),
        diferencia: Number(diferencia.toFixed(2)),
        eficiencia: Number(eficiencia.toFixed(2)),
        estado: eficiencia >= 95 ? 'Óptima' : eficiencia >= 85 ? 'Aceptable' : 'Baja',
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(`Error al calcular el tiempo de descarga: ${error.message}`);
    }
  }

  async calcularEficienciaDescarga(id_proceso: string) {
    try {
      const descargas = await this.findAllByIdProceso(id_proceso);

      if (descargas.length === 0) {
        throw new NotFoundException(`No hay registros de descarga para el proceso ${id_proceso}`);
      }

      let totalProgramado = 0;
      let totalReal = 0;
      let registrosConDatos = 0;

      descargas.forEach((descarga) => {
        if (descarga.cant_progra_desca !== null && descarga.cant_real_desca !== null) {
          totalProgramado += descarga.cant_progra_desca;
          totalReal += descarga.cant_real_desca;
          registrosConDatos++;
        }
      });

      if (registrosConDatos === 0) {
        throw new BadRequestException(
          'No se puede calcular la eficiencia sin los datos de cantidad programada y real en ninguno de los registros',
        );
      }

      const promedioProgramado = totalProgramado / registrosConDatos;
      const promedioReal = totalReal / registrosConDatos;
      const eficiencia = (promedioReal / promedioProgramado) * 100;
      const diferencia = promedioReal - promedioProgramado;

      return {
        id_proceso,
        total_registros: descargas.length,
        registros_con_datos: registrosConDatos,
        cant_programada_promedio: Number(promedioProgramado.toFixed(2)),
        cant_real_promedio: Number(promedioReal.toFixed(2)),
        diferencia: Number(diferencia.toFixed(2)),
        eficiencia: Number(eficiencia.toFixed(2)),
        estado: eficiencia >= 95 ? 'Óptima' : eficiencia >= 85 ? 'Aceptable' : 'Baja',
        detalle_registros: descargas.map((d) => ({
          id: d.id,
          folio_fruta: d.folio_fruta,
          cant_progra_desca: d.cant_progra_desca,
          cant_real_desca: d.cant_real_desca,
          fecha: d.fecha,
        })),
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(`Error al calcular la eficiencia de descarga: ${error.message}`);
    }
  }

  async calcularEficienciaDescargaIndividual(id: number) {
    try {
      const descarga = await this.findOne(id);

      if (!descarga.cant_progra_desca || !descarga.cant_real_desca) {
        throw new BadRequestException(
          'No se puede calcular la eficiencia sin los datos de cantidad programada y real',
        );
      }

      const eficiencia = (descarga.cant_real_desca / descarga.cant_progra_desca) * 100;
      const diferencia = descarga.cant_real_desca - descarga.cant_progra_desca;

      return {
        id: descarga.id,
        id_proceso: descarga.id_proceso,
        folio_fruta: descarga.folio_fruta,
        cant_programada: descarga.cant_progra_desca,
        cant_real: descarga.cant_real_desca,
        diferencia: Number(diferencia.toFixed(2)),
        eficiencia: Number(eficiencia.toFixed(2)),
        estado: eficiencia >= 95 ? 'Óptima' : eficiencia >= 85 ? 'Aceptable' : 'Baja',
        fecha_descarga: descarga.fecha,
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(`Error al calcular la eficiencia de descarga: ${error.message}`);
    }
  }

  async findByFechaRange(fechaInicio: Date, fechaFin: Date) {
    try {
      const fechaFinAdjusted = new Date(fechaFin);
      fechaFinAdjusted.setHours(23, 59, 59, 999);

      return await this.prisma.rEGISTRO_DESCARGA_FRUTA.findMany({
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

  async findByVariedad(variedad: string) {
    try {
      return await this.prisma.rEGISTRO_DESCARGA_FRUTA.findMany({
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
      throw new Error(`Error al obtener registros por variedad: ${error.message}`);
    }
  }

  async findByPlacasTransporte(placas: string) {
    try {
      return await this.prisma.rEGISTRO_DESCARGA_FRUTA.findMany({
        where: {
          placas_transporte: {
            contains: placas,
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
      throw new Error(`Error al obtener registros por placas de transporte: ${error.message}`);
    }
  }
}
