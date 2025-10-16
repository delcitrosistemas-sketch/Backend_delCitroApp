import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaProcesoService } from 'src/prisma/proceso/prisma.proceso.service';
import {
  CreateRefrigeracionPasteurizacionDto,
  CreateRefrigeracionPasteurizacionSingleDto,
  UpdateRefrigeracionPasteurizacionDto,
} from 'src/produccion/models/dtos/index.dto';
import { TipoProceso } from '.prisma/client-proceso';

@Injectable()
export class RefrigeracionService {
  constructor(private prisma: PrismaProcesoService) {}

  async create(data: CreateRefrigeracionPasteurizacionSingleDto) {
    try {
      const procesoExiste = await this.prisma.rEGISTRO_PROCESO.findUnique({
        where: { id_proceso: data.id_proceso },
      });

      if (!procesoExiste) {
        throw new NotFoundException(`El proceso con id_proceso ${data.id_proceso} no existe`);
      }

      const createData: any = {
        ...data,
        fecha: data.fecha || new Date(),
        inicio_envio: data.inicio_envio || new Date(),
        tipo_proceso: data.tipo_proceso || TipoProceso.Convencional,
      };

      return await this.prisma.rEGISTRO_REFRIGERACION_PASTEURIZACION.create({
        data: createData,
      });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      throw new Error(
        `Error al crear el registro de refrigeración/pasteurización: ${error.message}`,
      );
    }
  }

  async createMultiple(data: CreateRefrigeracionPasteurizacionDto) {
    try {
      const procesoExiste = await this.prisma.rEGISTRO_PROCESO.findUnique({
        where: { id_proceso: data.id_proceso },
      });

      if (!procesoExiste) {
        throw new NotFoundException(`El proceso con id_proceso ${data.id_proceso} no existe`);
      }

      // Crear múltiples registros
      const createPromises = data.secuencias.map((secuencia) => {
        const createData: any = {
          id_proceso: data.id_proceso,
          folio_fruta: data.folio_fruta,
          producto: data.producto,
          tipo_proceso: data.tipo_proceso || TipoProceso.Convencional,
          operador: data.operador,
          fecha: data.fecha || new Date(),
          ...secuencia,
        };

        return this.prisma.rEGISTRO_REFRIGERACION_PASTEURIZACION.create({
          data: createData,
        });
      });

      const results = await this.prisma.$transaction(createPromises);
      return results;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      throw new Error(
        `Error al crear los registros de refrigeración/pasteurización: ${error.message}`,
      );
    }
  }

  async findAll() {
    try {
      return await this.prisma.rEGISTRO_REFRIGERACION_PASTEURIZACION.findMany({
        include: {
          proceso: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      throw new Error(
        `Error al obtener los registros de refrigeración/pasteurización: ${error.message}`,
      );
    }
  }

  async findOne(id: number) {
    try {
      const registro = await this.prisma.rEGISTRO_REFRIGERACION_PASTEURIZACION.findUnique({
        where: { id },
        include: {
          proceso: true,
        },
      });

      if (!registro) {
        throw new NotFoundException(
          `Registro de refrigeración/pasteurización con ID ${id} no encontrado`,
        );
      }

      return registro;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(
        `Error al obtener el registro de refrigeración/pasteurización: ${error.message}`,
      );
    }
  }

  async findByFolioFruta(folio_fruta: string) {
    try {
      const registro = await this.prisma.rEGISTRO_REFRIGERACION_PASTEURIZACION.findFirst({
        where: { folio_fruta },
        include: {
          proceso: true,
        },
      });

      if (!registro) {
        throw new NotFoundException(
          `Registro de refrigeración/pasteurización con folio_fruta ${folio_fruta} no encontrado`,
        );
      }

      return registro;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(
        `Error al obtener el registro de refrigeración/pasteurización: ${error.message}`,
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

      const registro = await this.prisma.rEGISTRO_REFRIGERACION_PASTEURIZACION.findFirst({
        where: {
          id_proceso: id_proceso,
        },
        include: {
          proceso: true,
        },
      });

      if (!registro) {
        throw new NotFoundException(
          `Registro de refrigeración/pasteurización para proceso ${id_proceso} no encontrado`,
        );
      }

      return registro;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(
        `Error al obtener el registro de refrigeración/pasteurización: ${error.message}`,
      );
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

      const registros = await this.prisma.rEGISTRO_REFRIGERACION_PASTEURIZACION.findMany({
        where: {
          id_proceso: id_proceso,
        },
        include: {
          proceso: true,
        },
        orderBy: {
          secuencia: 'asc',
        },
      });

      return registros;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(
        `Error al obtener los registros de refrigeración/pasteurización: ${error.message}`,
      );
    }
  }

  async update(id: number, data: UpdateRefrigeracionPasteurizacionDto) {
    try {
      await this.findOne(id);

      return await this.prisma.rEGISTRO_REFRIGERACION_PASTEURIZACION.update({
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
        `Error al actualizar el registro de refrigeración/pasteurización: ${error.message}`,
      );
    }
  }

  async updateByFolioFruta(folio_fruta: string, data: UpdateRefrigeracionPasteurizacionDto) {
    try {
      const registro = await this.findByFolioFruta(folio_fruta);

      return await this.prisma.rEGISTRO_REFRIGERACION_PASTEURIZACION.update({
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
      throw new Error(
        `Error al actualizar el registro de refrigeración/pasteurización: ${error.message}`,
      );
    }
  }

  async updateByIdProceso(id_proceso: string, data: UpdateRefrigeracionPasteurizacionDto) {
    try {
      const registro = await this.findByIdProceso(id_proceso);

      return await this.prisma.rEGISTRO_REFRIGERACION_PASTEURIZACION.update({
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
      throw new Error(
        `Error al actualizar el registro de refrigeración/pasteurización: ${error.message}`,
      );
    }
  }

  async remove(id: number) {
    try {
      await this.findOne(id);

      return await this.prisma.rEGISTRO_REFRIGERACION_PASTEURIZACION.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(
        `Error al eliminar el registro de refrigeración/pasteurización: ${error.message}`,
      );
    }
  }

  async removeByFolioFruta(folio_fruta: string) {
    try {
      const registro = await this.findByFolioFruta(folio_fruta);

      return await this.prisma.rEGISTRO_REFRIGERACION_PASTEURIZACION.delete({
        where: { id: registro.id },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(
        `Error al eliminar el registro de refrigeración/pasteurización: ${error.message}`,
      );
    }
  }

  async removeByIdProceso(id_proceso: string) {
    try {
      const registro = await this.findByIdProceso(id_proceso);

      return await this.prisma.rEGISTRO_REFRIGERACION_PASTEURIZACION.delete({
        where: { id: registro.id },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(
        `Error al eliminar el registro de refrigeración/pasteurización: ${error.message}`,
      );
    }
  }

  async calcularTiempoEnvio(id_proceso: string) {
    try {
      const registros = await this.findAllByIdProceso(id_proceso);

      if (registros.length === 0) {
        throw new NotFoundException(
          `No hay registros de refrigeración/pasteurización para el proceso ${id_proceso}`,
        );
      }

      let totalTiempoEnvio = 0;
      let registrosConTiempo = 0;

      registros.forEach((registro) => {
        if (registro.inicio_envio && registro.fin_envio) {
          const tiempoEnvio = registro.fin_envio.getTime() - registro.inicio_envio.getTime();
          totalTiempoEnvio += tiempoEnvio;
          registrosConTiempo++;
        }
      });

      if (registrosConTiempo === 0) {
        throw new BadRequestException('No hay registros con tiempo de envío calculable');
      }

      const tiempoPromedioMs = totalTiempoEnvio / registrosConTiempo;
      const tiempoPromedioMin = tiempoPromedioMs / (1000 * 60);

      return {
        id_proceso,
        total_registros: registros.length,
        registros_con_tiempo: registrosConTiempo,
        tiempo_promedio_minutos: Number(tiempoPromedioMin.toFixed(2)),
        tiempo_promedio_horas: Number((tiempoPromedioMin / 60).toFixed(2)),
        estado:
          tiempoPromedioMin <= 30 ? 'Óptimo' : tiempoPromedioMin <= 60 ? 'Aceptable' : 'Lento',
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(`Error al calcular el tiempo de envío: ${error.message}`);
    }
  }

  async analizarTemperaturas(id_proceso: string) {
    try {
      const registros = await this.findAllByIdProceso(id_proceso);

      if (registros.length === 0) {
        throw new NotFoundException(
          `No hay registros de refrigeración/pasteurización para el proceso ${id_proceso}`,
        );
      }

      let totalTempInicio = 0;
      let totalTempMedio = 0;
      let totalTempFin = 0;
      let count = 0;

      registros.forEach((registro) => {
        if (registro.temp_inicio && registro.temp_medio && registro.temp_fin) {
          totalTempInicio += registro.temp_inicio;
          totalTempMedio += registro.temp_medio;
          totalTempFin += registro.temp_fin;
          count++;
        }
      });

      if (count === 0) {
        throw new BadRequestException('No hay registros con datos de temperatura completos');
      }

      const tempInicioPromedio = totalTempInicio / count;
      const tempMedioPromedio = totalTempMedio / count;
      const tempFinPromedio = totalTempFin / count;

      return {
        id_proceso,
        total_registros: registros.length,
        registros_con_datos: count,
        temperatura_inicio_promedio: Number(tempInicioPromedio.toFixed(2)),
        temperatura_medio_promedio: Number(tempMedioPromedio.toFixed(2)),
        temperatura_fin_promedio: Number(tempFinPromedio.toFixed(2)),
        variacion_temperatura: Number((tempFinPromedio - tempInicioPromedio).toFixed(2)),
        estado: this.evaluarEstadoTemperaturas(
          tempInicioPromedio,
          tempMedioPromedio,
          tempFinPromedio,
        ),
        recomendaciones: this.generarRecomendacionesTemperatura(
          tempInicioPromedio,
          tempMedioPromedio,
          tempFinPromedio,
        ),
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(`Error al analizar las temperaturas: ${error.message}`);
    }
  }

  private evaluarEstadoTemperaturas(inicio: number, medio: number, fin: number): string {
    const variacion = Math.abs(fin - inicio);

    if (variacion <= 2 && medio >= 4 && medio <= 8) {
      return 'Óptimo';
    } else if (variacion <= 5 && medio >= 2 && medio <= 10) {
      return 'Aceptable';
    } else {
      return 'Requiere ajuste';
    }
  }

  private generarRecomendacionesTemperatura(inicio: number, medio: number, fin: number): string[] {
    const recomendaciones: string[] = [];

    if (medio < 4) {
      recomendaciones.push('Aumentar temperatura de proceso medio');
    } else if (medio > 8) {
      recomendaciones.push('Reducir temperatura de proceso medio');
    }

    if (Math.abs(fin - inicio) > 5) {
      recomendaciones.push('Reducir variación de temperatura entre inicio y fin');
    }

    return recomendaciones.length > 0 ? recomendaciones : ['Temperaturas dentro de parámetros óptimos'];
  }

  async calcularEficienciaProceso(id_proceso: string) {
    try {
      const registros = await this.findAllByIdProceso(id_proceso);

      if (registros.length === 0) {
        throw new NotFoundException(
          `No hay registros de refrigeración/pasteurización para el proceso ${id_proceso}`,
        );
      }

      let puntuacionTotal = 0;
      let registrosEvaluados = 0;

      registros.forEach((registro) => {
        let puntuacionRegistro = 0;

        // Evaluar temperaturas (60 puntos)
        if (registro.temp_medio >= 4 && registro.temp_medio <= 8) {
          puntuacionRegistro += 40;
        } else if (registro.temp_medio >= 2 && registro.temp_medio <= 10) {
          puntuacionRegistro += 20;
        }

        // Evaluar tiempo de envío (40 puntos)
        if (registro.inicio_envio && registro.fin_envio) {
          const tiempoEnvio = registro.fin_envio.getTime() - registro.inicio_envio.getTime();
          const tiempoEnvioMin = tiempoEnvio / (1000 * 60);

          if (tiempoEnvioMin <= 30) {
            puntuacionRegistro += 40;
          } else if (tiempoEnvioMin <= 60) {
            puntuacionRegistro += 20;
          }
        }

        if (puntuacionRegistro > 0) {
          puntuacionTotal += puntuacionRegistro;
          registrosEvaluados++;
        }
      });

      if (registrosEvaluados === 0) {
        throw new BadRequestException('No hay registros con datos suficientes para evaluación');
      }

      const eficienciaPromedio = puntuacionTotal / registrosEvaluados;

      return {
        id_proceso,
        total_registros: registros.length,
        registros_evaluados: registrosEvaluados,
        puntuacion_promedio: Number(eficienciaPromedio.toFixed(2)),
        nivel_eficiencia:
          eficienciaPromedio >= 80 ? 'Alta' : eficienciaPromedio >= 60 ? 'Media' : 'Baja',
        recomendacion:
          eficienciaPromedio >= 80
            ? 'Proceso óptimo'
            : 'Revisar parámetros de temperatura y tiempo',
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(`Error al calcular la eficiencia del proceso: ${error.message}`);
    }
  }

  async findByFechaRange(fechaInicio: Date, fechaFin: Date) {
    try {
      const fechaFinAdjusted = new Date(fechaFin);
      fechaFinAdjusted.setHours(23, 59, 59, 999);

      return await this.prisma.rEGISTRO_REFRIGERACION_PASTEURIZACION.findMany({
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
      return await this.prisma.rEGISTRO_REFRIGERACION_PASTEURIZACION.findMany({
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
      return await this.prisma.rEGISTRO_REFRIGERACION_PASTEURIZACION.findMany({
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

  async findBySecuencia(secuencia: number) {
    try {
      return await this.prisma.rEGISTRO_REFRIGERACION_PASTEURIZACION.findMany({
        where: {
          secuencia: secuencia,
        },
        include: {
          proceso: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      throw new Error(`Error al obtener registros por secuencia: ${error.message}`);
    }
  }

  async getEstadisticasRefrigeracion() {
    try {
      const totalRegistros = await this.prisma.rEGISTRO_REFRIGERACION_PASTEURIZACION.count();

      const productosMasUsados = await this.prisma.rEGISTRO_REFRIGERACION_PASTEURIZACION.groupBy({
        by: ['producto'],
        _count: {
          producto: true,
        },
        _avg: {
          temp_medio: true,
          volumen: true,
        },
        orderBy: {
          _count: {
            producto: 'desc',
          },
        },
        take: 5,
      });

      const temperaturaPromedio = await this.prisma.rEGISTRO_REFRIGERACION_PASTEURIZACION.aggregate({
          _avg: {
            temp_medio: true,
          },
        },
      );

      const volumenPromedio = await this.prisma.rEGISTRO_REFRIGERACION_PASTEURIZACION.aggregate({
        _avg: {
          volumen: true,
        },
      });

      return {
        total_registros: totalRegistros,
        temperatura_media_promedio: Number(temperaturaPromedio._avg.temp_medio?.toFixed(2) || 0),
        volumen_promedio: Number(volumenPromedio._avg.volumen?.toFixed(2) || 0),
        productos_mas_usados: productosMasUsados,
      };
    } catch (error) {
      throw new Error(`Error al obtener estadísticas de refrigeración: ${error.message}`);
    }
  }
}
