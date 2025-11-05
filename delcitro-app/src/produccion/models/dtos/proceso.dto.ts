import { IsString, IsEnum, IsOptional, IsDate } from 'class-validator';
import { TipoProceso } from '.prisma/client';
import { Type } from 'class-transformer';

class CreateRegistroProcesoDto {
  @IsString()
  id_proceso?: string;

  @IsEnum(TipoProceso)
  tipo_proceso: TipoProceso;

  @IsString()
  variedad: string;

  @IsString()
  destino: string;

  @IsOptional()
  @IsString()
  lote_asignado?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  fecha?: Date;
}

class UpdateRegistroProcesoDto {
  @IsString()
  id_proceso: string;

  @IsOptional()
  @IsEnum(TipoProceso)
  tipo_proceso?: TipoProceso;

  @IsOptional()
  variedad?: string;

  @IsOptional()
  destino?: string;

  @IsOptional()
  lote_asignado?: string;
}

export { CreateRegistroProcesoDto, UpdateRegistroProcesoDto };
