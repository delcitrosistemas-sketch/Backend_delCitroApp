import { IsString, IsNumber, IsOptional, IsDate, IsEnum, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { TipoProceso } from '.prisma/client';

class CreateExtractoresFinisherDto {
  @IsString()
  id_proceso: string;

  @IsString()
  folio_fruta: string;

  @IsString()
  producto: string;

  @IsEnum(TipoProceso)
  @IsOptional()
  tipo_proceso?: TipoProceso;

  @IsInt()
  num_extractor: number;

  @IsInt()
  modelo: number;

  @IsNumber()
  medida_extractor: number;

  @IsInt()
  cap_ext: number;

  @IsNumber()
  presion: number;

  @IsString()
  ajuste_micro: string;

  @IsString()
  valor_extraccion: string;

  @IsString()
  @IsOptional()
  observaciones?: string;

  @IsString()
  psi_finisher_primario: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  fecha?: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  hora?: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  hora_finisher_primario?: Date;
}

class UpdateExtractoresFinisherDto {
  @IsString()
  @IsOptional()
  producto?: string;

  @IsEnum(TipoProceso)
  @IsOptional()
  tipo_proceso?: TipoProceso;

  @IsOptional()
  @IsString()
  folio_fruta: string;

  @IsInt()
  @IsOptional()
  num_extractor?: number;

  @IsInt()
  @IsOptional()
  modelo?: number;

  @IsNumber()
  @IsOptional()
  medida_extractor?: number;

  @IsInt()
  @IsOptional()
  cap_ext?: number;

  @IsNumber()
  @IsOptional()
  presion?: number;

  @IsString()
  @IsOptional()
  ajuste_micro?: string;

  @IsString()
  @IsOptional()
  valor_extraccion?: string;

  @IsString()
  @IsOptional()
  observaciones?: string;

  @IsString()
  @IsOptional()
  psi_finisher_primario?: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  fecha?: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  hora?: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  hora_finisher_primario?: Date;
}

export { UpdateExtractoresFinisherDto, CreateExtractoresFinisherDto };
