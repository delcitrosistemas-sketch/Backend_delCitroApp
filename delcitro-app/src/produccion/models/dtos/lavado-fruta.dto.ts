import { IsString, IsEnum, IsOptional, IsDate, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { TipoProceso } from '.prisma/client';

class CreateVerificacionDetergenteDto {
  @IsString()
  id_proceso: string;

  @IsOptional()
  @IsString()
  folio_fruta: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  fecha?: Date;

  @IsEnum(TipoProceso)
  tipo_proceso: TipoProceso;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  hora?: Date;

  @IsNumber()
  cant_agua: number;

  @IsString()
  producto: string;

  @IsNumber()
  cantidad: number;

  @IsOptional()
  @IsNumber()
  concentracion?: number;

  @IsOptional()
  @IsString()
  resp_dilucion?: string;

  @IsOptional()
  @IsNumber()
  num_orden?: number;
}

class UpdateVerificacionDetergenteDto {
  @IsOptional()
  @IsString()
  folio_fruta?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  fecha?: Date;

  @IsOptional()
  @IsEnum(TipoProceso)
  tipo_proceso?: TipoProceso;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  hora?: Date;

  @IsOptional()
  @IsNumber()
  cant_agua?: number;

  @IsOptional()
  @IsString()
  producto?: string;

  @IsOptional()
  @IsNumber()
  cantidad?: number;

  @IsOptional()
  @IsNumber()
  concentracion?: number;

  @IsOptional()
  @IsString()
  resp_dilucion?: string;

  @IsOptional()
  @IsNumber()
  num_orden?: number;
}

export { CreateVerificacionDetergenteDto, UpdateVerificacionDetergenteDto };
