export class CreateRegistroDto {
  folio: string;
  fecha: Date;
  boleta: number;
  placas_transporte: string;
  variedad: string;
  destino: string;
  inicio_descarga?: Date;
  fin_descarga?: Date;
  cant_progra_desca?: number;
  cant_real_desca?: number;
  proveedor_id: number;
  detalles_id: number;
}
