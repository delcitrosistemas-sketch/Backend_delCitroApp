export class CreateMuestreoDto {
  id: number;
  fecha: Date;
  proveedor_id: number;
  huertero?: string;
  lote: string;
  ciudad: string;
  estado: string;
  ton_aprox?: number;
  bta: number;
  acidez: number;
  rto: number;
  rendimiento: number;
  sabor: string;
  color: string;
  aceite?: number;
  observaciones?: string;
  analizo: string;
}
