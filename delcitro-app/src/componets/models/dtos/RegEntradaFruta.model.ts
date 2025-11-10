import { IsString, IsNumber, IsDate, IsOptional, IsEmail } from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';

export class CreateDetallesRegistroEntradaFrutaDto {
  @IsOptional()
  @IsNumber()
  bins?: number;

  @IsOptional()
  @IsString()
  jaula?: string;

  @IsOptional()
  @IsString()
  estado?: string;

  @IsOptional()
  @IsString()
  municipio?: string;

  @IsOptional()
  @IsString()
  huerta?: string;

  @IsOptional()
  @IsString()
  observaciones?: string;

  @IsOptional()
  @IsNumber()
  muestra_id?: number;
}

export class CreateRegistroEntradaFrutaDto {
  @IsString()
  folio: string;

  @IsDate()
  @Type(() => Date)
  fecha: Date;

  @IsString()
  boleta: string;

  @IsString()
  placas_transporte: string;

  @IsOptional()
  @IsString()
  chofer?: string;

  @IsString()
  variedad: string;

  @IsString()
  destino: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  inicio_descarga?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  fin_descarga?: Date;

  @IsOptional()
  @IsNumber()
  cant_progra_desca?: number;

  @IsOptional()
  @IsNumber()
  cant_real_desca?: number;

  @IsNumber()
  proveedor_id: number;

  @IsOptional()
  detalles?: CreateDetallesRegistroEntradaFrutaDto;
}

export class CreateProveedorDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsString()
  empresa: string;

  @IsOptional()
  @IsString()
  direccion?: string;

  @IsString()
  estado: string;

  @IsOptional()
  @IsString()
  codigoPostal?: string;

  @IsOptional()
  @IsString()
  pais?: string;

  @IsString()
  telefono: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}

export class CreateMuestreoDto {
  @IsDate()
  @Type(() => Date)
  fecha: Date;

  @IsNumber()
  proveedor_id: number;

  @IsOptional()
  @IsString()
  huertero?: string;

  @IsString()
  lote: string;

  @IsString()
  ciudad: string;

  @IsString()
  estado: string;

  @IsOptional()
  @IsNumber()
  ton_aprox?: number;

  @IsNumber()
  bta: number;

  @IsNumber()
  acidez: number;

  @IsNumber()
  rto: number;

  @IsNumber()
  rendimiento: number;

  @IsString()
  sabor: string;

  @IsString()
  color: string;

  @IsOptional()
  @IsNumber()
  aceite?: number;

  @IsOptional()
  @IsString()
  observaciones?: string;

  @IsString()
  analizo: string;
}

export class UpdateMuestreoDto extends PartialType(CreateMuestreoDto) {}
export class UpdateProveedorDto extends PartialType(CreateProveedorDto) {}
export class UpdateDetallesRegistroEntradaFrutaDto extends PartialType(
  CreateDetallesRegistroEntradaFrutaDto,
) {}

export class UpdateRegistroEntradaFrutaDto extends PartialType(CreateRegistroEntradaFrutaDto) {
  @IsOptional()
  detalles?: UpdateDetallesRegistroEntradaFrutaDto;
}
