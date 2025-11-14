import { IsString, IsEnum, IsOptional, IsDate, IsNumber, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { TipoProceso } from '.prisma/client';

class CreateReporteMermaDto {
  @IsString()
  id_proceso: string;

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
  @IsOptional()
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

  @IsNumber()
  peso_bruto: number;

  @IsNumber()
  peso_tara: number;

  @IsNumber()
  peso_neto: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  turno?: number;

  @IsOptional()
  @IsString()
  observaciones?: string;
}

class UpdateReporteMermaDto {
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  fecha: Date;

  @IsOptional()
  @IsInt()
  num_orden?: number;

  @IsOptional()
  @IsEnum(TipoProceso)
  tipo_proceso: TipoProceso;

  @IsOptional()
  @IsString()
  area?: string;

  @IsOptional()
  @IsString()
  variedad?: string;

  @IsNumber()
  @IsOptional()
  turno: number;

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
