import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaProcesoService } from 'src/prisma/proceso/prisma.proceso.service';
import {
  CreateExtractoresFinisherDto,
  UpdateExtractoresFinisherDto,
} from 'src/produccion/models/dtos/index.dto';

@Injectable()
export class ExtraccionService {
  constructor(private prisma: PrismaProcesoService) {}

  async create(data: CreateExtractoresFinisherDto) {
    try {
      const procesoExiste = await this.prisma.rEGISTRO_PROCESO.findUnique({
        where: { id_proceso: data.id_proceso },
      });

      if (!procesoExiste) {
        throw new NotFoundException(`El proceso con id_proceso ${data.id_proceso} no existe`);
      }

      const folioExiste = await this.prisma.rEGISTRO_EXTRACTORES_FINISHER.findUnique({
        where: { folio_fruta: data.folio_fruta },
      });

      if (folioExiste) {
        throw new ConflictException(`El folio_fruta ${data.folio_fruta} ya existe`);
      }

      return await this.prisma.rEGISTRO_EXTRACTORES_FINISHER.create({
        data: {
          ...data,
          fecha: data.fecha || new Date(),
          hora: data.hora || new Date(),
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      throw new Error(`Error al crear el registro de extractores finisher: ${error.message}`);
    }
  }

  async findAll() {
    try {
      return await this.prisma.rEGISTRO_EXTRACTORES_FINISHER.findMany({
        include: {
          proceso: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      throw new Error(`Error al obtener los registros de extractores finisher: ${error.message}`);
    }
  }

  async findOne(id: number) {
    try {
      const registro = await this.prisma.rEGISTRO_EXTRACTORES_FINISHER.findUnique({
        where: { id },
        include: {
          proceso: true,
        },
      });

      if (!registro) {
        throw new NotFoundException(`Registro de extractores finisher con ID ${id} no encontrado`);
      }

      return registro;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Error al obtener el registro de extractores finisher: ${error.message}`);
    }
  }

  async findByFolioFruta(folio_fruta: string) {
    try {
      const registro = await this.prisma.rEGISTRO_EXTRACTORES_FINISHER.findUnique({
        where: { folio_fruta },
        include: {
          proceso: true,
        },
      });

      if (!registro) {
        throw new NotFoundException(
          `Registro de extractores finisher con folio_fruta ${folio_fruta} no encontrado`,
        );
      }

      return registro;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Error al obtener el registro de extractores finisher: ${error.message}`);
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

      const registro = await this.prisma.rEGISTRO_EXTRACTORES_FINISHER.findFirst({
        where: {
          id_proceso: id_proceso,
        },
        include: {
          proceso: true,
        },
      });

      if (!registro) {
        throw new NotFoundException(
          `Registro de extractores finisher para proceso ${id_proceso} no encontrado`,
        );
      }

      return registro;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Error al obtener el registro de extractores finisher: ${error.message}`);
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

      const registros = await this.prisma.rEGISTRO_EXTRACTORES_FINISHER.findMany({
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

      return registros;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Error al obtener los registros de extractores finisher: ${error.message}`);
    }
  }

  async update(id: number, data: UpdateExtractoresFinisherDto) {
    try {
      await this.findOne(id);

      return await this.prisma.rEGISTRO_EXTRACTORES_FINISHER.update({
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
      throw new Error(`Error al actualizar el registro de extractores finisher: ${error.message}`);
    }
  }

  async updateByFolioFruta(folio_fruta: string, data: UpdateExtractoresFinisherDto) {
    try {
      const registro = await this.findByFolioFruta(folio_fruta);

      return await this.prisma.rEGISTRO_EXTRACTORES_FINISHER.update({
        where: { id: registro.id },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Error al actualizar el registro de extractores finisher: ${error.message}`);
    }
  }

  async updateByIdProceso(id_proceso: string, data: UpdateExtractoresFinisherDto) {
    try {
      const registro = await this.findByIdProceso(id_proceso);

      return await this.prisma.rEGISTRO_EXTRACTORES_FINISHER.update({
        where: { id: registro.id },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Error al actualizar el registro de extractores finisher: ${error.message}`);
    }
  }

  async remove(id: number) {
    try {
      await this.findOne(id);

      return await this.prisma.rEGISTRO_EXTRACTORES_FINISHER.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Error al eliminar el registro de extractores finisher: ${error.message}`);
    }
  }

  async removeByFolioFruta(folio_fruta: string) {
    try {
      const registro = await this.findByFolioFruta(folio_fruta);

      return await this.prisma.rEGISTRO_EXTRACTORES_FINISHER.delete({
        where: { id: registro.id },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Error al eliminar el registro de extractores finisher: ${error.message}`);
    }
  }

  async removeByIdProceso(id_proceso: string) {
    try {
      const registro = await this.findByIdProceso(id_proceso);

      return await this.prisma.rEGISTRO_EXTRACTORES_FINISHER.delete({
        where: { id: registro.id },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Error al eliminar el registro de extractores finisher: ${error.message}`);
    }
  }

  async calcularEficienciaExtraccion(id_proceso: string) {
    try {
      const registro = await this.findByIdProceso(id_proceso);

      let puntuacion = 0;

      if (registro.presion >= 1.5 && registro.presion <= 3.0) {
        puntuacion += 40;
      } else if (registro.presion >= 1.0 && registro.presion <= 3.5) {
        puntuacion += 20;
      }

      if (registro.valor_extraccion) {
        const valorLimpio = registro.valor_extraccion.toLowerCase();
        if (
          valorLimpio.includes('óptimo') ||
          valorLimpio.includes('optimo') ||
          valorLimpio.includes('excelente')
        ) {
          puntuacion += 40;
        } else if (valorLimpio.includes('bueno') || valorLimpio.includes('aceptable')) {
          puntuacion += 20;
        }
      }

      if (registro.cap_ext >= 80) {
        puntuacion += 20;
      } else if (registro.cap_ext >= 60) {
        puntuacion += 10;
      }

      return {
        id_proceso,
        producto: registro.producto,
        presion: registro.presion,
        valor_extraccion: registro.valor_extraccion,
        cap_ext: registro.cap_ext,
        puntuacion_eficiencia: puntuacion,
        nivel_eficiencia: puntuacion >= 80 ? 'Alta' : puntuacion >= 60 ? 'Media' : 'Baja',
        recomendacion: this.generarRecomendacion(registro, puntuacion),
        parametros_evaluados: {
          presion: registro.presion >= 1.5 && registro.presion <= 3.0 ? 'Óptima' : 'Fuera de rango',
          valor_extraccion: registro.valor_extraccion ? 'Evaluado' : 'No evaluado',
          capacidad: registro.cap_ext >= 80 ? 'Alta' : registro.cap_ext >= 60 ? 'Media' : 'Baja'
        },
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Error al calcular la eficiencia de extracción: ${error.message}`);
    }
  }

  private generarRecomendacion(registro: any, puntuacion: number): string {
    if (puntuacion >= 80) {
      return 'Proceso óptimo, mantener parámetros actuales';
    }

    const recomendaciones: string[] = [];

    if (registro.presion < 1.5 || registro.presion > 3.0) {
      recomendaciones.push('Ajustar presión al rango óptimo (1.5 - 3.0)');
    }

    if (registro.cap_ext < 80) {
      recomendaciones.push('Optimizar capacidad del extractor');
    }

    if (
      !registro.valor_extraccion ||
      (!registro.valor_extraccion.toLowerCase().includes('óptimo') &&
        !registro.valor_extraccion.toLowerCase().includes('optimo'))
    ) {
      recomendaciones.push('Revisar ajuste micro y valor de extracción');
    }

    return recomendaciones.length > 0 ? recomendaciones.join('; ') : 'Revisar todos los parámetros';
  }

  async analizarRendimientoExtractores(id_proceso: string) {
    try {
      const registros = await this.findAllByIdProceso(id_proceso);

      if (registros.length === 0) {
        throw new NotFoundException(
          `No hay registros de extractores para el proceso ${id_proceso}`,
        );
      }

      let totalPresion = 0;
      let totalCapacidad = 0;
      let count = 0;

      registros.forEach((registro) => {
        if (registro.presion && registro.cap_ext) {
          totalPresion += registro.presion;
          totalCapacidad += registro.cap_ext;
          count++;
        }
      });

      if (count === 0) {
        throw new BadRequestException('No hay datos suficientes para el análisis');
      }

      const presionPromedio = totalPresion / count;
      const capacidadPromedio = totalCapacidad / count;

      return {
        id_proceso,
        total_extractores: registros.length,
        extractores_con_datos: count,
        presion_promedio: Number(presionPromedio.toFixed(2)),
        capacidad_promedio: Number(capacidadPromedio.toFixed(2)),
        estado_presion:
          presionPromedio >= 1.5 && presionPromedio <= 3.0 ? 'Óptima' : 'Requiere ajuste',
        estado_capacidad:
          capacidadPromedio >= 80 ? 'Alta' : capacidadPromedio >= 60 ? 'Media' : 'Baja',
        recomendaciones_generales: this.generarRecomendacionesGenerales(
          presionPromedio,
          capacidadPromedio,
        ),
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(`Error al analizar el rendimiento de extractores: ${error.message}`);
    }
  }

  private generarRecomendacionesGenerales(
    presionPromedio: number,
    capacidadPromedio: number,
  ): string[] {
    const recomendaciones: string[] = [];

    if (presionPromedio < 1.5) {
      recomendaciones.push('Aumentar presión promedio de los extractores');
    } else if (presionPromedio > 3.0) {
      recomendaciones.push('Reducir presión promedio de los extractores');
    }

    if (capacidadPromedio < 80) {
      recomendaciones.push('Mejorar capacidad de extracción promedio');
    }

    return recomendaciones;
  }

  async findByFechaRange(fechaInicio: Date, fechaFin: Date) {
    try {
      const fechaFinAdjusted = new Date(fechaFin);
      fechaFinAdjusted.setHours(23, 59, 59, 999);

      return await this.prisma.rEGISTRO_EXTRACTORES_FINISHER.findMany({
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
      return await this.prisma.rEGISTRO_EXTRACTORES_FINISHER.findMany({
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
      return await this.prisma.rEGISTRO_EXTRACTORES_FINISHER.findMany({
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

  async findByNumExtractor(num_extractor: number) {
    try {
      return await this.prisma.rEGISTRO_EXTRACTORES_FINISHER.findMany({
        where: {
          num_extractor: num_extractor,
        },
        include: {
          proceso: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      throw new Error(`Error al obtener registros por número de extractor: ${error.message}`);
    }
  }

  async getEstadisticasExtractores() {
    try {
      const totalRegistros = await this.prisma.rEGISTRO_EXTRACTORES_FINISHER.count();

      const productosMasUsados = await this.prisma.rEGISTRO_EXTRACTORES_FINISHER.groupBy({
        by: ['producto'],
        _count: {
          producto: true,
        },
        _avg: {
          presion: true,
          cap_ext: true,
        },
        orderBy: {
          _count: {
            producto: 'desc',
          },
        },
        take: 5,
      });

      const presionPromedio = await this.prisma.rEGISTRO_EXTRACTORES_FINISHER.aggregate({
        _avg: {
          presion: true,
        },
      });

      const capacidadPromedio = await this.prisma.rEGISTRO_EXTRACTORES_FINISHER.aggregate({
        _avg: {
          cap_ext: true,
        },
      });

      return {
        total_registros: totalRegistros,
        presion_promedio: Number(presionPromedio._avg.presion?.toFixed(2) || 0),
        capacidad_promedio: Number(capacidadPromedio._avg.cap_ext?.toFixed(2) || 0),
        productos_mas_usados: productosMasUsados,
      };
    } catch (error) {
      throw new Error(`Error al obtener estadísticas de extractores: ${error.message}`);
    }
  }
}
