// src/produccion/proceso/proceso.types.ts
export interface EstadisticaMensual {
  mes: string;
  nombre: string;
  cantidad: number;
}
export interface EstadisticaMensualAnual {
  año: number;
  mes: number;
  nombre: string;
  nombreCorto: string;
  cantidad: number;
  fechaCompleta: Date;
  periodo: string;
}

export interface EstadisticaAnual {
  año: number;
  cantidad: number;
}

export interface EstadisticaDiaria {
  fecha: string;
  cantidad: number;
  diaSemana: string;
}

export interface EstadisticaPorTipo {
  tipo: string;
  cantidad: number;
  porcentaje: number;
}

export interface EstadisticaPorVariedad {
  variedad: string;
  cantidad: number;
}

export interface EstadisticaPorStatus {
  status: string;
  cantidad: number;
}

export interface EstadisticasCompletas {
  mensual: EstadisticaMensual[];
  diario: EstadisticaDiaria[];
  anual: EstadisticaAnual[];
  mensualAnual: EstadisticaMensualAnual[];
  porTipo: EstadisticaPorTipo[];
  porVariedad: EstadisticaPorVariedad[];
  porStatus: EstadisticaPorStatus[];
  totalHoy: number;
  resumen: {
    totalProcesos: number;
    promedioDiario: number;
    tendencia: 'ascendente' | 'descendente' | 'estable';
  };
}