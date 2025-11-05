import { IsString, IsEnum, IsOptional, IsDate, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { TipoProceso } from '.prisma/client';

class CreateDescargaFrutaDto {
  @IsString()
  id_proceso: string;

  @IsString()
  folio_fruta: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  fecha?: Date;

  @IsString()
  placas_transporte: string;

  @IsString()
  variedad: string;

  @IsString()
  destino: string;

  @IsEnum(TipoProceso)
  tipo_proceso: TipoProceso;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  inicio_descarga?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  fin_descarga?: Date;

  @IsOptional()
  @IsNumber()
  cant_progra_desca?: number;

  @IsOptional()
  @IsNumber()
  cant_real_desca?: number;

  @IsOptional()
  @IsString()
  observaciones?: string;
}

class UpdateDescargaFrutaDto {
  @IsOptional()
  @IsString()
  folio_fruta?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  fecha?: Date;

  @IsOptional()
  @IsString()
  placas_transporte?: string;

  @IsOptional()
  @IsString()
  variedad?: string;

  @IsOptional()
  @IsString()
  destino?: string;

  @IsOptional()
  @IsEnum(TipoProceso)
  tipo_proceso?: TipoProceso;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  inicio_descarga?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  fin_descarga?: Date;

  @IsOptional()
  @IsNumber()
  cant_progra_desca?: number;

  @IsOptional()
  @IsNumber()
  cant_real_desca?: number;

  @IsOptional()
  @IsNumber()
  num_orden?: number;

  @IsOptional()
  @IsString()
  observaciones?: string;
}

export { CreateDescargaFrutaDto, UpdateDescargaFrutaDto };
