import {
  IsString,
  IsNumber,
  IsOptional,
  IsDate,
  IsEnum,
  IsInt,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TipoProceso } from '.prisma/client-proceso';

class SecuenciaDto {
  @IsInt()
  secuencia: number;

  @IsInt()
  tpf: number;

  @IsInt()
  volumen: number;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  fecha?: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  inicio_envio?: Date;

  @IsNumber()
  temp_inicio: number;

  @IsNumber()
  temp_medio: number;

  @IsNumber()
  temp_fin: number;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  fin_envio?: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  tiempo_envio?: Date;
}

class CreateRefrigeracionPasteurizacionDto {
  @IsString()
  id_proceso: string;

  @IsString()
  @IsOptional()
  folio_fruta?: string;

  @IsString()
  producto: string;

  @IsEnum(TipoProceso)
  @IsOptional()
  tipo_proceso?: TipoProceso;

  @IsString()
  @IsOptional()
  operador?: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  fecha?: Date;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SecuenciaDto)
  secuencias: SecuenciaDto[];
}

class CreateRefrigeracionPasteurizacionSingleDto {
  @IsString()
  id_proceso: string;

  @IsString()
  @IsOptional()
  folio_fruta?: string;

  @IsString()
  producto: string;

  @IsEnum(TipoProceso)
  @IsOptional()
  tipo_proceso?: TipoProceso;

  @IsInt()
  secuencia: number;

  @IsInt()
  tpf: number;

  @IsInt()
  volumen: number;

  @IsNumber()
  temp_inicio: number;

  @IsNumber()
  temp_medio: number;

  @IsNumber()
  temp_fin: number;

  @IsString()
  @IsOptional()
  operador?: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  fecha?: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  inicio_envio?: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  fin_envio?: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  tiempo_envio?: Date;
}

class UpdateRefrigeracionPasteurizacionDto {
  @IsString()
  @IsOptional()
  folio_fruta?: string;

  @IsString()
  @IsOptional()
  producto?: string;

  @IsEnum(TipoProceso)
  @IsOptional()
  tipo_proceso?: TipoProceso;

  @IsInt()
  @IsOptional()
  secuencia?: number;

  @IsInt()
  @IsOptional()
  tpf?: number;

  @IsInt()
  @IsOptional()
  volumen?: number;

  @IsNumber()
  @IsOptional()
  temp_inicio?: number;

  @IsNumber()
  @IsOptional()
  temp_medio?: number;

  @IsNumber()
  @IsOptional()
  temp_fin?: number;

  @IsString()
  @IsOptional()
  operador?: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  fecha?: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  inicio_envio?: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  fin_envio?: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  tiempo_envio?: Date;
}

export {
  UpdateRefrigeracionPasteurizacionDto,
  CreateRefrigeracionPasteurizacionDto,
  CreateRefrigeracionPasteurizacionSingleDto,
  SecuenciaDto,
};
