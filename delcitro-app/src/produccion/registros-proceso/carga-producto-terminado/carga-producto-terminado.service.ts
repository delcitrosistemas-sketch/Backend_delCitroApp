import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaProcesoService } from 'src/prisma/proceso/prisma.proceso.service';
import { RESPUESTA_FORMULARIOS } from '.prisma/client-proceso';
import {
  CreateRegistroSalidaTransporteDto,
  CreateRevisionDocumentacionDto,
  CreateRevisionTransporteDto,
  UpdateRegistroSalidaTransporteDto,
  UpdateRevisionDocumentacionDto,
  UpdateRevisionTransporteDto,
} from 'src/produccion/models/dtos/index.dto';

@Injectable()
export class CargaProductoTerminadoService {
  constructor(private prisma: PrismaProcesoService) {}

  // ========== REGISTRO SALIDA TRANSPORTE ==========

  async createRegistroSalida(data: CreateRegistroSalidaTransporteDto) {
    try {
      const procesoExiste = await this.prisma.rEGISTRO_PROCESO.findUnique({
        where: { id_proceso: data.id_proceso },
      });

      console.log(JSON.stringify(data.id_proceso));

      if (!procesoExiste) {
        throw new NotFoundException(`El proceso con id_proceso ${data.id_proceso} no existe`);
      }

      return await this.prisma.rEGISTRO_SALIDA_TRANSPORTE.create({
        data: {
          id_proceso: data.id_proceso,
          fecha_entrada: data.fecha_entrada,
          fecha_salida: data.fecha_salida,
          fecha_realizo: data.fecha_realizo || new Date(),
          num_placas_unidad: data.num_placas_unidad,
          num_placas_pipa: data.num_placas_pipa,
          linea_transporte: data.linea_transporte,
          firma_chofer: data.firma_chofer,
          nombre_chofer: data.nombre_chofer,
          nombre_realizo: data.nombre_realizo,
          firma_realizo: data.firma_realizo,
          revision_documentacion: {
            create: data.revision_documentacion,
          },
          revision_transporte: {
            create: data.revision_transporte,
          },
        },
        include: {
          proceso: true,
          revision_documentacion: true,
          revision_transporte: true,
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      throw new Error(`Error al crear el registro de salida de transporte: ${error.message}`);
    }
  }

  async findAllRegistrosSalida() {
    try {
      return await this.prisma.rEGISTRO_SALIDA_TRANSPORTE.findMany({
        include: {
          proceso: true,
          revision_documentacion: true,
          revision_transporte: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      throw new Error(`Error al obtener los registros de salida de transporte: ${error.message}`);
    }
  }

  async findRegistroSalidaById(id: number) {
    try {
      const registro = await this.prisma.rEGISTRO_SALIDA_TRANSPORTE.findUnique({
        where: { id },
        include: {
          proceso: true,
          revision_documentacion: true,
          revision_transporte: true,
        },
      });

      if (!registro) {
        throw new NotFoundException(`Registro de salida de transporte con ID ${id} no encontrado`);
      }

      return registro;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Error al obtener el registro de salida de transporte: ${error.message}`);
    }
  }

  async findRegistroSalidaByIdProceso(id_proceso: string) {
    try {
      const procesoExists = await this.prisma.rEGISTRO_PROCESO.findUnique({
        where: { id_proceso },
      });

      if (!procesoExists) {
        throw new NotFoundException(`El proceso con id_proceso ${id_proceso} no existe`);
      }

      const registro = await this.prisma.rEGISTRO_SALIDA_TRANSPORTE.findFirst({
        where: {
          id_proceso: id_proceso,
        },
        include: {
          proceso: true,
          revision_documentacion: true,
          revision_transporte: true,
        },
      });

      if (!registro) {
        throw new NotFoundException(
          `Registro de salida de transporte para proceso ${id_proceso} no encontrado`,
        );
      }

      return registro;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Error al obtener el registro de salida de transporte: ${error.message}`);
    }
  }

  async updateRegistroSalida(id: number, data: UpdateRegistroSalidaTransporteDto) {
    try {
      const registroExistente = await this.findRegistroSalidaById(id);

      const baseData: any = {
        ...data,
        updatedAt: new Date(),
      };

      const { revision_documentacion, revision_transporte, ...updateData } = baseData;

      // Usar transacción para actualizar el registro principal y las relaciones
      return await this.prisma.$transaction(async (tx) => {
        // 1. Actualizar el registro principal
        const registroActualizado = await tx.rEGISTRO_SALIDA_TRANSPORTE.update({
          where: { id },
          data: updateData,
        });

        if (revision_documentacion) {
          const revisionDocExistente = await tx.rEVISION_DOCUMENTACION.findFirst({
            where: { registro_salida_id: id },
          });

          if (revisionDocExistente) {
            await tx.rEVISION_DOCUMENTACION.update({
              where: { id: revisionDocExistente.id },
              data: revision_documentacion,
            });
          } else {
            // Crear nueva revisión
            await tx.rEVISION_DOCUMENTACION.create({
              data: {
                registro_salida_id: id,
                ...revision_documentacion,
              },
            });
          }
        }

        if (revision_transporte) {
          const revisionTransExistente = await tx.rEVISION_TRANSPORTE.findFirst({
            where: { registro_salida_id: id },
          });

          if (revisionTransExistente) {
            await tx.rEVISION_TRANSPORTE.update({
              where: { id: revisionTransExistente.id },
              data: revision_transporte,
            });
          } else {
            // Crear nueva revisión
            await tx.rEVISION_TRANSPORTE.create({
              data: {
                registro_salida_id: id,
                ...revision_transporte,
              },
            });
          }
        }

        // 4. Retornar el registro completo con las relaciones actualizadas
        return await tx.rEGISTRO_SALIDA_TRANSPORTE.findUnique({
          where: { id },
          include: {
            proceso: true,
            revision_documentacion: true,
            revision_transporte: true,
          },
        });
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Error al actualizar el registro de salida de transporte: ${error.message}`);
    }
  }

  async removeRegistroSalida(id: number) {
    try {
      await this.findRegistroSalidaById(id);

      return await this.prisma.rEGISTRO_SALIDA_TRANSPORTE.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Error al eliminar el registro de salida de transporte: ${error.message}`);
    }
  }

  // ========== REVISIÓN DOCUMENTACIÓN ==========

  async createRevisionDocumentacion(data: CreateRevisionDocumentacionDto) {
    try {
      // Verificar que el registro de salida existe
      const registroExiste = await this.prisma.rEGISTRO_SALIDA_TRANSPORTE.findUnique({
        where: { id: data.registro_salida_id },
      });

      if (!registroExiste) {
        throw new NotFoundException(
          `Registro de salida con ID ${data.registro_salida_id} no encontrado`,
        );
      }

      return await this.prisma.rEVISION_DOCUMENTACION.create({
        data,
        include: {
          registro_salida_pipa: {
            include: {
              proceso: true,
            },
          },
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Error al crear la revisión de documentación: ${error.message}`);
    }
  }

  async findRevisionDocumentacionById(id: number) {
    try {
      const revision = await this.prisma.rEVISION_DOCUMENTACION.findUnique({
        where: { id },
        include: {
          registro_salida_pipa: {
            include: {
              proceso: true,
            },
          },
        },
      });

      if (!revision) {
        throw new NotFoundException(`Revisión de documentación con ID ${id} no encontrada`);
      }

      return revision;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Error al obtener la revisión de documentación: ${error.message}`);
    }
  }

  async findRevisionDocumentacionByRegistroSalida(registro_salida_id: number) {
    try {
      const revisiones = await this.prisma.rEVISION_DOCUMENTACION.findMany({
        where: { registro_salida_id },
        include: {
          registro_salida_pipa: {
            include: {
              proceso: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return revisiones;
    } catch (error) {
      throw new Error(`Error al obtener las revisiones de documentación: ${error.message}`);
    }
  }

  async updateRevisionDocumentacion(id: number, data: UpdateRevisionDocumentacionDto) {
    try {
      await this.findRevisionDocumentacionById(id);

      return await this.prisma.rEVISION_DOCUMENTACION.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date(),
        },
        include: {
          registro_salida_pipa: {
            include: {
              proceso: true,
            },
          },
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Error al actualizar la revisión de documentación: ${error.message}`);
    }
  }

  async removeRevisionDocumentacion(id: number) {
    try {
      await this.findRevisionDocumentacionById(id);

      return await this.prisma.rEVISION_DOCUMENTACION.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Error al eliminar la revisión de documentación: ${error.message}`);
    }
  }

  // ========== REVISIÓN TRANSPORTE ==========

  async createRevisionTransporte(data: CreateRevisionTransporteDto) {
    try {
      // Verificar que el registro de salida existe
      const registroExiste = await this.prisma.rEGISTRO_SALIDA_TRANSPORTE.findUnique({
        where: { id: data.registro_salida_id },
      });

      if (!registroExiste) {
        throw new NotFoundException(
          `Registro de salida con ID ${data.registro_salida_id} no encontrado`,
        );
      }

      return await this.prisma.rEVISION_TRANSPORTE.create({
        data,
        include: {
          registro_salida_pipa: {
            include: {
              proceso: true,
            },
          },
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Error al crear la revisión de transporte: ${error.message}`);
    }
  }

  async findRevisionTransporteById(id: number) {
    try {
      const revision = await this.prisma.rEVISION_TRANSPORTE.findUnique({
        where: { id },
        include: {
          registro_salida_pipa: {
            include: {
              proceso: true,
            },
          },
        },
      });

      if (!revision) {
        throw new NotFoundException(`Revisión de transporte con ID ${id} no encontrada`);
      }

      return revision;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Error al obtener la revisión de transporte: ${error.message}`);
    }
  }

  async findRevisionTransporteByRegistroSalida(registro_salida_id: number) {
    try {
      const revisiones = await this.prisma.rEVISION_TRANSPORTE.findMany({
        where: { registro_salida_id },
        include: {
          registro_salida_pipa: {
            include: {
              proceso: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return revisiones;
    } catch (error) {
      throw new Error(`Error al obtener las revisiones de transporte: ${error.message}`);
    }
  }

  async updateRevisionTransporte(id: number, data: UpdateRevisionTransporteDto) {
    try {
      await this.findRevisionTransporteById(id);

      return await this.prisma.rEVISION_TRANSPORTE.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date(),
        },
        include: {
          registro_salida_pipa: {
            include: {
              proceso: true,
            },
          },
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Error al actualizar la revisión de transporte: ${error.message}`);
    }
  }

  async removeRevisionTransporte(id: number) {
    try {
      await this.findRevisionTransporteById(id);

      return await this.prisma.rEVISION_TRANSPORTE.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Error al eliminar la revisión de transporte: ${error.message}`);
    }
  }

  // ========== MÉTODOS DE ANÁLISIS Y CÁLCULOS ==========

  async calcularTiempoCarga(id_proceso: string) {
    try {
      const registro = await this.findRegistroSalidaByIdProceso(id_proceso);

      if (!registro.fecha_entrada || !registro.fecha_salida) {
        throw new BadRequestException(
          'No se puede calcular el tiempo de carga sin las fechas de entrada y salida',
        );
      }

      const tiempoCargaMs = registro.fecha_salida.getTime() - registro.fecha_entrada.getTime();
      const tiempoCargaMin = tiempoCargaMs / (1000 * 60);
      const tiempoCargaHoras = tiempoCargaMin / 60;

      return {
        id_proceso,
        fecha_entrada: registro.fecha_entrada,
        fecha_salida: registro.fecha_salida,
        tiempo_carga_minutos: Number(tiempoCargaMin.toFixed(2)),
        tiempo_carga_horas: Number(tiempoCargaHoras.toFixed(2)),
        estado: tiempoCargaMin <= 60 ? 'Óptimo' : tiempoCargaMin <= 120 ? 'Aceptable' : 'Lento',
        recomendacion: tiempoCargaMin > 120 ? 'Optimizar proceso de carga' : 'Proceso dentro de parámetros',
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(`Error al calcular el tiempo de carga: ${error.message}`);
    }
  }

  async analizarDocumentacionCompleta(registro_salida_id: number) {
    try {
      const revisiones = await this.findRevisionDocumentacionByRegistroSalida(registro_salida_id);

      if (revisiones.length === 0) {
        throw new NotFoundException(
          `No hay revisiones de documentación para el registro ${registro_salida_id}`,
        );
      }

      const ultimaRevision = revisiones[0]; // Tomar la revisión más reciente

      const camposRequeridos = [
        'boleta_bascula',
        'manifiesto_carga',
        'certificado_analisis',
        'certificado_lavado',
        'certificado_inspeccion',
        'certificado_fumigacion',
        'certificado_ult_carga',
        'certificado_orden_carga',
        'carga_porte',
      ];

      let documentosAprobados = 0;
      const documentosDetalle: any = {};

      camposRequeridos.forEach((campo) => {
        const valor = ultimaRevision[campo];
        documentosDetalle[campo] = {
          valor,
          aprobado: valor === RESPUESTA_FORMULARIOS.C,
        };
        if (valor === RESPUESTA_FORMULARIOS.C) {
          documentosAprobados++;
        }
      });

      const porcentajeAprobacion = (documentosAprobados / camposRequeridos.length) * 100;

      return {
        registro_salida_id,
        total_documentos: camposRequeridos.length,
        documentos_aprobados: documentosAprobados,
        porcentaje_aprobacion: Number(porcentajeAprobacion.toFixed(2)),
        estado:
          porcentajeAprobacion === 100
            ? 'Completo'
            : porcentajeAprobacion >= 80
              ? 'Aceptable'
              : 'Incompleto',
        documentos_detalle: documentosDetalle,
        requiere_atencion: porcentajeAprobacion < 100,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Error al analizar la documentación: ${error.message}`);
    }
  }

  async analizarCondicionTransporte(registro_salida_id: number) {
    try {
      const revisiones = await this.findRevisionTransporteByRegistroSalida(registro_salida_id);

      if (revisiones.length === 0) {
        throw new NotFoundException(
          `No hay revisiones de transporte para el registro ${registro_salida_id}`,
        );
      }

      const ultimaRevision = revisiones[0]; // Tomar la revisión más reciente

      const camposTransporte = [
        'corresponde_placas_num_unidad',
        'corresponde_placas_num_termo_pipa',
        'sin_perforaciones_caja_tanque',
        'condicion_paredes',
        'gatas_correas',
        'libre_insectos',
        'libre_olores',
        'libre_contaminacion',
        'condicion_piso',
        'residuos_carga_ant',
        'fuga',
        'sellos_escotilla_val_puerta',
        'difusor_termo',
        'temp_int_termo',
      ];

      let condicionesAprobadas = 0;
      const condicionesDetalle: any = {};

      camposTransporte.forEach((campo) => {
        const valor = ultimaRevision[campo];
        condicionesDetalle[campo] = {
          valor,
          aprobado: valor === RESPUESTA_FORMULARIOS.C,
        };
        if (valor === RESPUESTA_FORMULARIOS.C) {
          condicionesAprobadas++;
        }
      });

      const porcentajeAprobacion = (condicionesAprobadas / camposTransporte.length) * 100;

      return {
        registro_salida_id,
        total_condiciones: camposTransporte.length,
        condiciones_aprobadas: condicionesAprobadas,
        porcentaje_aprobacion: Number(porcentajeAprobacion.toFixed(2)),
        estado: porcentajeAprobacion === 100 ? 'Óptimo' : porcentajeAprobacion >= 90 ? 'Aceptable' : 'Requiere atención',
        condiciones_detalle: condicionesDetalle,
        recomendacion: porcentajeAprobacion < 100 ? 'Revisar condiciones del transporte' : 'Transporte en óptimas condiciones',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Error al analizar la condición del transporte: ${error.message}`);
    }
  }

  async calcularEficienciaCargaCompleta(id_proceso: string) {
    try {
      const registro = await this.findRegistroSalidaByIdProceso(id_proceso);
      
      let puntuacionTotal = 0;
      let factoresEvaluados = 0;

      // Evaluar tiempo de carga (40 puntos)
      if (registro.fecha_entrada && registro.fecha_salida) {
        const tiempoCargaMs = registro.fecha_salida.getTime() - registro.fecha_entrada.getTime();
        const tiempoCargaMin = tiempoCargaMs / (1000 * 60);
        
        if (tiempoCargaMin <= 60) {
          puntuacionTotal += 40;
        } else if (tiempoCargaMin <= 120) {
          puntuacionTotal += 20;
        }
        factoresEvaluados++;
      }

      // Evaluar documentación (30 puntos)
      try {
        const analisisDoc = await this.analizarDocumentacionCompleta(registro.id);
        if (analisisDoc.porcentaje_aprobacion === 100) {
          puntuacionTotal += 30;
        } else if (analisisDoc.porcentaje_aprobacion >= 80) {
          puntuacionTotal += 15;
        }
        factoresEvaluados++;
      } catch (error) {
        // Si no hay documentación, no suma puntos
      }

      // Evaluar condición del transporte (30 puntos)
      try {
        const analisisTrans = await this.analizarCondicionTransporte(registro.id);
        if (analisisTrans.porcentaje_aprobacion === 100) {
          puntuacionTotal += 30;
        } else if (analisisTrans.porcentaje_aprobacion >= 90) {
          puntuacionTotal += 15;
        }
        factoresEvaluados++;
      } catch (error) {
        // Si no hay revisión de transporte, no suma puntos
      }

      const eficiencia = factoresEvaluados > 0 ? (puntuacionTotal / factoresEvaluados) : 0;

      return {
        id_proceso,
        registro_salida_id: registro.id,
        puntuacion_total: puntuacionTotal,
        factores_evaluados: factoresEvaluados,
        eficiencia_promedio: Number(eficiencia.toFixed(2)),
        nivel_eficiencia: eficiencia >= 80 ? 'Alta' : eficiencia >= 60 ? 'Media' : 'Baja',
        estado_general: eficiencia >= 80 ? 'Óptimo' : eficiencia >= 60 ? 'Aceptable' : 'Requiere mejora',
        recomendaciones: this.generarRecomendacionesCarga(eficiencia),
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Error al calcular la eficiencia de carga: ${error.message}`);
    }
  }

  private generarRecomendacionesCarga(eficiencia: number): string[] {
    const recomendaciones: string[] = [];

    if (eficiencia < 80) {
      recomendaciones.push('Optimizar tiempo de carga');
      recomendaciones.push('Completar documentación requerida');
      recomendaciones.push('Mejorar condiciones del transporte');
    }

    if (eficiencia < 60) {
      recomendaciones.push('Revisar proceso completo de carga');
      recomendaciones.push('Capacitar al personal involucrado');
      recomendaciones.push('Implementar checklist de verificación');
    }

    return recomendaciones.length > 0 ? recomendaciones : ['Proceso de carga óptimo'];
  }

  async getEstadisticasCarga() {
    try {
      const totalRegistros = await this.prisma.rEGISTRO_SALIDA_TRANSPORTE.count();
      
      const lineasTransporte = await this.prisma.rEGISTRO_SALIDA_TRANSPORTE.groupBy({
        by: ['linea_transporte'],
        _count: {
          linea_transporte: true,
        },
        orderBy: {
          _count: {
            linea_transporte: 'desc',
          },
        },
        take: 10,
      });

      const choferesFrecuentes = await this.prisma.rEGISTRO_SALIDA_TRANSPORTE.groupBy({
        by: ['nombre_chofer'],
        _count: {
          nombre_chofer: true,
        },
        orderBy: {
          _count: {
            nombre_chofer: 'desc',
          },
        },
        take: 10,
      });

      return {
        total_registros: totalRegistros,
        lineas_transporte_mas_usadas: lineasTransporte,
        choferes_frecuentes: choferesFrecuentes,
      };
    } catch (error) {
      throw new Error(`Error al obtener estadísticas de carga: ${error.message}`);
    }
  }

  // ========== MÉTODOS DE BÚSQUEDA ==========

  async findByPlacasUnidad(placas: string) {
    try {
      return await this.prisma.rEGISTRO_SALIDA_TRANSPORTE.findMany({
        where: {
          num_placas_unidad: {
            contains: placas,
            mode: 'insensitive',
          },
        },
        include: {
          proceso: true,
          revision_documentacion: true,
          revision_transporte: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      throw new Error(`Error al obtener registros por placas de unidad: ${error.message}`);
    }
  }

  async findByPlacasPipa(placas: string) {
    try {
      return await this.prisma.rEGISTRO_SALIDA_TRANSPORTE.findMany({
        where: {
          num_placas_pipa: {
            contains: placas,
            mode: 'insensitive',
          },
        },
        include: {
          proceso: true,
          revision_documentacion: true,
          revision_transporte: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      throw new Error(`Error al obtener registros por placas de pipa: ${error.message}`);
    }
  }

  async findByLineaTransporte(linea: string) {
    try {
      return await this.prisma.rEGISTRO_SALIDA_TRANSPORTE.findMany({
        where: {
          linea_transporte: {
            contains: linea,
            mode: 'insensitive',
          },
        },
        include: {
          proceso: true,
          revision_documentacion: true,
          revision_transporte: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      throw new Error(`Error al obtener registros por línea de transporte: ${error.message}`);
    }
  }

  async findByChofer(nombre_chofer: string) {
    try {
      return await this.prisma.rEGISTRO_SALIDA_TRANSPORTE.findMany({
        where: {
          nombre_chofer: {
            contains: nombre_chofer,
            mode: 'insensitive',
          },
        },
        include: {
          proceso: true,
          revision_documentacion: true,
          revision_transporte: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      throw new Error(`Error al obtener registros por chofer: ${error.message}`);
    }
  }

  async findByFechaRange(fechaInicio: Date, fechaFin: Date) {
    try {
      const fechaFinAdjusted = new Date(fechaFin);
      fechaFinAdjusted.setHours(23, 59, 59, 999);

      return await this.prisma.rEGISTRO_SALIDA_TRANSPORTE.findMany({
        where: {
          fecha_realizo: {
            gte: fechaInicio,
            lte: fechaFinAdjusted,
          },
        },
        include: {
          proceso: true,
          revision_documentacion: true,
          revision_transporte: true,
        },
        orderBy: {
          fecha_realizo: 'desc',
        },
      });
    } catch (error) {
      throw new Error(`Error al obtener registros por rango de fecha: ${error.message}`);
    }
  }
}
