import { IsString, IsEnum, IsOptional, IsDate, IsNumber, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { TipoProceso } from '.prisma/client-proceso';

class CreateReporteMermaDto {
  @IsString()
  id_proceso: string;

  @IsString()
  folio_fruta: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  fecha?: Date;

  @IsEnum(TipoProceso)
  tipo_proceso: TipoProceso;

  @IsString()
  variedad: string;

  @IsInt()
  num_orden: number;

  @IsString()
  area: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  hora_pesado?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  fin_descarga?: Date;

  @IsOptional()
  @IsNumber()
  cant_progra_desca?: number;

  @IsNumber()
  peso_bruto: number;

  @IsNumber()
  peso_tara: number;

  @IsNumber()
  peso_neto: number;

  @IsOptional()
  @IsString()
  observaciones?: string;
}

class UpdateReporteMermaDto {
  @IsOptional()
  @IsString()
  folio_fruta?: string;

  @IsOptional()
  @IsInt()
  num_orden?: number;

  @IsOptional()
  @IsString()
  area?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  hora_pesado?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  fin_descarga?: Date;

  @IsOptional()
  @IsNumber()
  cant_progra_desca?: number;

  @IsOptional()
  @IsNumber()
  peso_bruto?: number;

  @IsOptional()
  @IsNumber()
  peso_tara?: number;

  @IsOptional()
  @IsNumber()
  peso_neto?: number;

  @IsOptional()
  @IsString()
  observaciones?: string;
}

export { CreateReporteMermaDto, UpdateReporteMermaDto };
