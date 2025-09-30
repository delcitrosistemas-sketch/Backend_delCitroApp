import { IsDate, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

class CreateMuestreoDto {
  @IsNotEmpty()
  @IsInt()
  id: number;

  @IsNotEmpty()
  @IsDate()
  fecha: Date;

  @IsNotEmpty()
  @IsInt()
  proveedor_id: number;

  @IsOptional()
  @IsString()
  huertero?: string;

  @IsNotEmpty()
  @IsString()
  lote: string;

  @IsOptional()
  @IsString()
  ciudad: string;

  @IsOptional()
  @IsString()
  estado: string;

  @IsOptional()
  @IsInt()
  ton_aprox?: number;

  @IsNotEmpty()
  @IsInt()
  bta: number;

  @IsNotEmpty()
  @IsInt()
  acidez: number;

  @IsNotEmpty()
  @IsInt()
  rto: number;

  @IsNotEmpty()
  @IsInt()
  rendimiento: number;

  @IsNotEmpty()
  @IsInt()
  sabor: string;

  @IsOptional()
  @IsString()
  color: string;

  @IsOptional()
  @IsInt()
  aceite?: number;

  @IsOptional()
  @IsString()
  observaciones?: string;

  @IsNotEmpty()
  @IsString()
  analizo: string;
}

export { CreateMuestreoDto };
