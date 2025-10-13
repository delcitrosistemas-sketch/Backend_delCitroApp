import { Injectable } from '@nestjs/common';
import { PrismaProcesoService } from 'src/prisma/proceso/prisma.proceso.service';
import { FoliosService } from 'src/shared/folios/folios.service';
import {
  EstadisticaAnual,
  EstadisticaMensual,
  EstadisticaMensualAnual,
} from '../models/types/estadisticas.types';

@Injectable()
export class EstadisticasProcesoService {
  constructor(
    private prisma: PrismaProcesoService,
    private folioService: FoliosService,
  ) {}

  async getEstadisticasCompletas() {
    try {
      const [
        estadisticasMensuales,
        estadisticasDiarias,
        estadisticasAnuales,
        estadisticasAnualesMensuales,
        estadisticasPorTipo,
        estadisticasPorVariedad,
        estadisticasPorStatus,
        totalProcesosHoy,
      ] = await Promise.all([
        this.getEstadisticasMensuales(),
        this.getEstadisticasDiarias(),
        this.getEstadisticasAnuales(),
        this.getEstadisticasMensualAnual(),
        this.getEstadisticasPorTipoProceso(),
        this.getEstadisticasPorVariedad(),
        this.getEstadisticasPorStatus(),
        this.getTotalProcesosHoy(),
      ]);

      return {
        mensual: estadisticasMensuales,
        diario: estadisticasDiarias,
        anual: estadisticasAnuales,
        mensualAnual: estadisticasAnualesMensuales,
        porTipo: estadisticasPorTipo,
        porVariedad: estadisticasPorVariedad,
        porStatus: estadisticasPorStatus,
        totalHoy: totalProcesosHoy,
        resumen: {
          totalProcesos: await this.prisma.rEGISTRO_PROCESO.count(),
          promedioDiario: await this.calcularPromedioDiario(),
          tendencia: await this.calcularTendencia(),
        },
      };
    } catch (error) {
      throw new Error(`Error al obtener estadísticas completas: ${error.message}`);
    }
  }

  // Estadísticas mensuales (últimos 12 meses)
  async getEstadisticasMensuales(): Promise<EstadisticaMensual[]> {
    const fechaFin = new Date();
    const fechaInicio = new Date();
    fechaInicio.setMonth(fechaInicio.getMonth() - 11);

    const resultados = await this.prisma.rEGISTRO_PROCESO.groupBy({
      by: ['fecha'],
      _count: {
        id: true,
      },
      where: {
        fecha: {
          gte: fechaInicio,
          lte: fechaFin,
        },
      },
    });

    // Especifica el tipo del objeto meses
    const meses: { [key: string]: EstadisticaMensual } = {};

    resultados.forEach((item) => {
      const fecha = new Date(item.fecha);
      const clave = `${fecha.getFullYear()}-${(fecha.getMonth() + 1).toString().padStart(2, '0')}`;
      const nombreMes = fecha.toLocaleString('es-ES', { month: 'long', year: 'numeric' });

      if (!meses[clave]) {
        meses[clave] = {
          mes: clave,
          nombre: nombreMes,
          cantidad: 0,
        };
      }
      meses[clave].cantidad += item._count.id;
    });

    // Ahora TypeScript conoce el tipo
    return Object.values(meses).sort((a: EstadisticaMensual, b: EstadisticaMensual) =>
      a.mes.localeCompare(b.mes),
    );
  }

  // Estadísticas diarias (últimos 30 días)
  async getEstadisticasDiarias() {
    const fechaFin = new Date();
    const fechaInicio = new Date();
    fechaInicio.setDate(fechaInicio.getDate() - 29); // Últimos 30 días

    const resultados = await this.prisma.rEGISTRO_PROCESO.groupBy({
      by: ['fecha'],
      _count: {
        id: true,
      },
      where: {
        fecha: {
          gte: fechaInicio,
          lte: fechaFin,
        },
      },
      orderBy: {
        fecha: 'asc',
      },
    });

    return resultados.map((item) => ({
      fecha: this.formatDate(item.fecha),
      cantidad: item._count.id,
      diaSemana: new Date(item.fecha).toLocaleDateString('es-ES', { weekday: 'short' }),
    }));
  }

  // Estadísticas mensuales (últimos 60 meses - 5 años)
  async getEstadisticasMensualAnual(): Promise<EstadisticaMensualAnual[]> {
    const fechaFin = new Date();
    const fechaInicio = new Date();
    fechaInicio.setMonth(fechaInicio.getMonth() - 59); // Últimos 60 meses

    const resultados = await this.prisma.rEGISTRO_PROCESO.groupBy({
      by: ['fecha'],
      _count: {
        id: true,
      },
      where: {
        fecha: {
          gte: fechaInicio,
          lte: fechaFin,
        },
      },
      orderBy: {
        fecha: 'asc',
      },
    });

    // Crear un mapa para agrupar por año y mes
    const mesesMap: { [key: string]: EstadisticaMensualAnual } = {};

    // Inicializar todos los meses de los últimos 5 años con 0
    const currentYear = fechaFin.getFullYear();
    const currentMonth = fechaFin.getMonth() + 1;

    for (let i = 59; i >= 0; i--) {
      const tempDate = new Date();
      tempDate.setMonth(tempDate.getMonth() - i);
      const año = tempDate.getFullYear();
      const mes = tempDate.getMonth() + 1;
      const clave = `${año}-${mes.toString().padStart(2, '0')}`;

      const fechaMes = new Date(año, mes - 1, 1);
      const nombreMes = fechaMes.toLocaleDateString('es-ES', {
        month: 'short',
        year: 'numeric',
      });
      const nombreCorto = fechaMes.toLocaleDateString('es-ES', {
        month: 'short',
      });

      mesesMap[clave] = {
        año: año,
        mes: mes,
        nombre: nombreMes,
        nombreCorto: nombreCorto,
        cantidad: 0,
        fechaCompleta: fechaMes,
        periodo: clave,
      };
    }

    // Llenar con datos reales
    resultados.forEach((item) => {
      const fecha = new Date(item.fecha);
      const año = fecha.getFullYear();
      const mes = fecha.getMonth() + 1;
      const clave = `${año}-${mes.toString().padStart(2, '0')}`;

      if (mesesMap[clave]) {
        mesesMap[clave].cantidad += item._count.id;
      }
    });

    // Convertir a array y ordenar cronológicamente
    const mesesArray = Object.values(mesesMap).sort((a, b) => {
      if (a.año !== b.año) return a.año - b.año;
      return a.mes - b.mes;
    });

    return mesesArray;
  }
  // Estadísticas anuales (últimos 5 años)
  async getEstadisticasAnuales(): Promise<EstadisticaAnual[]> {
    const fechaFin = new Date();
    const fechaInicio = new Date();
    fechaInicio.setFullYear(fechaInicio.getFullYear() - 4);

    const resultados = await this.prisma.rEGISTRO_PROCESO.groupBy({
      by: ['fecha'],
      _count: {
        id: true,
      },
      where: {
        fecha: {
          gte: fechaInicio,
          lte: fechaFin,
        },
      },
    });

    // Especifica el tipo del objeto años
    const años: { [key: number]: EstadisticaAnual } = {};

    resultados.forEach((item) => {
      const año = new Date(item.fecha).getFullYear();
      if (!años[año]) {
        años[año] = {
          año: año,
          cantidad: 0,
        };
      }
      años[año].cantidad += item._count.id;
    });

    return Object.values(años).sort((a: EstadisticaAnual, b: EstadisticaAnual) => a.año - b.año);
  }

  // Estadísticas por tipo de proceso
  async getEstadisticasPorTipoProceso() {
    const resultados = await this.prisma.rEGISTRO_PROCESO.groupBy({
      by: ['tipo_proceso'],
      _count: {
        id: true,
      },
    });

    return resultados.map((item) => ({
      tipo: item.tipo_proceso,
      cantidad: item._count.id,
      porcentaje: 0, // Se calculará en el frontend si es necesario
    }));
  }

  // 5. Estadísticas por variedad (top 10)
  async getEstadisticasPorVariedad() {
    // Obtener el mes y año actual
    const ahora = new Date();
    const añoActual = ahora.getFullYear();
    const mesActual = ahora.getMonth() + 1; // Los meses van de 0-11, así que sumamos 1

    // Obtener estadísticas generales
    const resultados = await this.prisma.rEGISTRO_PROCESO.groupBy({
      by: ['variedad'],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 10,
    });

    // Obtener estadísticas del mes actual
    const resultadosMesActual = await this.prisma.rEGISTRO_PROCESO.groupBy({
      by: ['variedad'],
      _count: {
        id: true,
      },
      where: {
        fecha: {
          gte: new Date(añoActual, mesActual - 1, 1), // Primer día del mes
          lt: new Date(añoActual, mesActual, 1), // Primer día del siguiente mes
        },
      },
    });

    // Calcular total general y total del mes actual
    const totalGeneral = resultados.reduce((sum, item) => sum + item._count.id, 0);
    const totalMesActual = resultadosMesActual.reduce((sum, item) => sum + item._count.id, 0);

    return resultados.map((item) => {
      // Encontrar la cantidad para esta variedad en el mes actual
      const variedadMesActual = resultadosMesActual.find(v => v.variedad === item.variedad);
      const cantidadMesActual = variedadMesActual?._count.id || 0;

      // Calcular porcentajes
      const porcentajeGeneral = totalGeneral > 0 ? (item._count.id / totalGeneral) * 100 : 0;
      const porcentajeMesActual =
        totalMesActual > 0 ? (cantidadMesActual / totalMesActual) * 100 : 0;

      return {
        variedad: item.variedad,
        cantidad: item._count.id,
        cantidadMesActual: cantidadMesActual,
        porcentaje: Math.round(porcentajeGeneral * 100) / 100, // Redondear a 2 decimales
        porcentajeMesActual: Math.round(porcentajeMesActual * 100) / 100,
        mesActual: `${mesActual}/${añoActual}`,
        tendencia: this.calcularTendenciaVariedad(
          item._count.id,
          cantidadMesActual,
          totalGeneral,
          totalMesActual,
        ),
      };
    });
  }

  // Método auxiliar para calcular la tendencia
  private calcularTendenciaVariedad(
    cantidadTotal: number,
    cantidadMesActual: number,
    totalGeneral: number,
    totalMesActual: number,
  ): string {
    if (totalGeneral === 0 || totalMesActual === 0) return 'estable';

    const porcentajeHistorico = (cantidadTotal / totalGeneral) * 100;
    const porcentajeActual = (cantidadMesActual / totalMesActual) * 100;

    const diferencia = porcentajeActual - porcentajeHistorico;

    if (diferencia > 5) return 'ascendente';
    if (diferencia < -5) return 'descendente';
    return 'estable';
  }

  // Estadísticas por status
  async getEstadisticasPorStatus() {
    const resultados = await this.prisma.rEGISTRO_PROCESO.groupBy({
      by: ['status'],
      _count: {
        id: true,
      },
    });

    return resultados.map((item) => ({
      status: item.status || 'Sin Estado',
      cantidad: item._count.id,
    }));
  }

  // Total de procesos creados hoy
  async getTotalProcesosHoy() {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const mañana = new Date(hoy);
    mañana.setDate(mañana.getDate() + 1);

    return await this.prisma.rEGISTRO_PROCESO.count({
      where: {
        createdAt: {
          gte: hoy,
          lt: mañana,
        },
      },
    });
  }

  // Métodos auxiliares
  private async calcularPromedioDiario(): Promise<number> {
    const primerProceso = await this.prisma.rEGISTRO_PROCESO.findFirst({
      orderBy: {
        createdAt: 'asc',
      },
      select: {
        createdAt: true,
      },
    });

    if (!primerProceso) return 0;

    const diasTranscurridos = Math.ceil(
      (new Date().getTime() - primerProceso.createdAt.getTime()) / (1000 * 60 * 60 * 24),
    );

    const totalProcesos = await this.prisma.rEGISTRO_PROCESO.count();

    return diasTranscurridos > 0 ? Number((totalProcesos / diasTranscurridos).toFixed(2)) : 0;
  }

  private async calcularTendencia(): Promise<'ascendente' | 'descendente' | 'estable'> {
    const hoy = new Date();
    const semanaPasada = new Date(hoy);
    semanaPasada.setDate(semanaPasada.getDate() - 7);

    const procesosEstaSemana = await this.prisma.rEGISTRO_PROCESO.count({
      where: {
        createdAt: {
          gte: semanaPasada,
          lte: hoy,
        },
      },
    });

    const dosSemanasAtras = new Date(semanaPasada);
    dosSemanasAtras.setDate(dosSemanasAtras.getDate() - 7);

    const procesosSemanaPasada = await this.prisma.rEGISTRO_PROCESO.count({
      where: {
        createdAt: {
          gte: dosSemanasAtras,
          lt: semanaPasada,
        },
      },
    });

    if (procesosEstaSemana > procesosSemanaPasada) return 'ascendente';
    if (procesosEstaSemana < procesosSemanaPasada) return 'descendente';
    return 'estable';
  }

  // Método auxiliar para formatear fechas
  private formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
}
