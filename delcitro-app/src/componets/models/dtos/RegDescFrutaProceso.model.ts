import { IsString, IsNotEmpty, IsEnum, IsOptional, IsDate, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export enum TipoProceso {
  CONVENCIONAL = 'convencional',
  ORGANICO = 'organico',
}

export class CreateRegistroDescargaFrutaDto {
  @IsNotEmpty({ message: 'El ID de proceso es requerido' })
  @IsString({ message: 'El ID de proceso debe ser texto' })
  id_proceso: string;

  @IsNotEmpty({ message: 'El folio de fruta es requerido' })
  @IsString({ message: 'El folio de fruta debe ser texto' })
  folio_fruta: string;

  @IsOptional()
  @IsDate({ message: 'La fecha debe ser válida' })
  @Type(() => Date)
  fecha?: Date;

  @IsNotEmpty({ message: 'Las placas de transporte son requeridas' })
  @IsString({ message: 'Las placas deben ser texto' })
  placas_transporte: string;

  @IsNotEmpty({ message: 'La variedad es requerida' })
  @IsString({ message: 'La variedad debe ser texto' })
  variedad: string;

  @IsNotEmpty({ message: 'El destino es requerido' })
  @IsString({ message: 'El destino debe ser texto' })
  destino: string;

  @IsNotEmpty({ message: 'El tipo de proceso es requerido' })
  @IsEnum(TipoProceso, { message: 'El tipo de proceso debe ser "convencional" u "organico"' })
  tipo_proceso: TipoProceso;

  @IsOptional()
  @IsDate({ message: 'La fecha de inicio de descarga debe ser válida' })
  @Type(() => Date)
  inicio_descarga?: Date;

  @IsOptional()
  @IsDate({ message: 'La fecha de fin de descarga debe ser válida' })
  @Type(() => Date)
  fin_descarga?: Date;

  @IsOptional()
  @IsNumber({}, { message: 'La cantidad programada debe ser un número' })
  cant_progra_desca?: number;

  @IsOptional()
  @IsNumber({}, { message: 'La cantidad real debe ser un número' })
  cant_real_desca?: number;
}
