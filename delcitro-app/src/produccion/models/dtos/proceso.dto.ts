import { IsString, IsEnum, IsOptional, IsDate } from 'class-validator';
import { TipoProceso } from '.prisma/client-proceso';
import { Type } from 'class-transformer';

export class CreateRegistroProcesoDto {
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

export class UpdateRegistroProcesoDto {
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
