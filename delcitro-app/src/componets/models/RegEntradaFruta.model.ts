export class CreateRegistroDto {
  folio: string;
  fecha: Date;
  boleta: number;
  placas_transporte: string;
  variedad: string;
  destino: string;
  chofer: string;
  inicio_descarga?: Date;
  fin_descarga?: Date;
  cant_progra_desca?: number;
  cant_real_desca?: number;
  proveedor_id: number;

  detalles?: {
    bins?: number;
    jaula?: string;
    estado?: string;
    municipio?: string;
    huerta?: string;
    observaciones?: string;
    muestra_id?: number;
  };
}

export class UpdateRegistroDto {
  fecha: Date;
  placas_transporte: string;
  variedad: string;
  destino: string;
  inicio_descarga?: Date;
  fin_descarga?: Date;
  cant_progra_desca?: number;
  cant_real_desca?: number;
}
