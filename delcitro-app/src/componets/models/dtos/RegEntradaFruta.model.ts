import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDate,
  IsInt,
  Min,
  Max,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class DetallesDto {
  @IsOptional()
  @IsInt({ message: 'Bins debe ser un número entero' })
  @Min(0, { message: 'Bins no puede ser negativo' })
  bins?: number;

  @IsOptional()
  @IsString({ message: 'Jaula debe ser un texto' })
  jaula?: string;

  @IsOptional()
  @IsString({ message: 'Estado debe ser un texto' })
  estado?: string;

  @IsOptional()
  @IsString({ message: 'Municipio debe ser un texto' })
  municipio?: string;

  @IsOptional()
  @IsString({ message: 'Huerta debe ser un texto' })
  huerta?: string;

  @IsOptional()
  @IsString({ message: 'Observaciones debe ser un texto' })
  observaciones?: string;

  @IsOptional()
  @IsInt({ message: 'Muestra ID debe ser un número entero' })
  muestra_id?: number;
}

class CreateRegistroDto {
  @IsNotEmpty({ message: 'El folio es requerido' })
  @IsString({ message: 'El folio debe ser un texto' })
  folio: string;

  @IsNotEmpty({ message: 'La fecha es requerida' })
  @IsDate({ message: 'La fecha debe ser una fecha válida' })
  @Type(() => Date)
  fecha: Date;

  @IsNotEmpty({ message: 'Las placas de transporte son requeridas' })
  @IsString({ message: 'Las placas deben ser un texto' })
  @Matches(/^[A-Z0-9-]+$/, { message: 'Formato de placas inválido' })
  placas_transporte: string;

  @IsNotEmpty({ message: 'La variedad es requerida' })
  @IsString({ message: 'La variedad debe ser un texto' })
  variedad: string;

  @IsNotEmpty({ message: 'El destino es requerida' })
  @IsString({ message: 'El destino debe ser un texto' })
  destino: string;

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
  @Min(0, { message: 'La cantidad programada no puede ser negativa' })
  @Max(100000, { message: 'La cantidad programada no puede exceder 100,000' })
  cant_progra_desca?: number;

  @IsOptional()
  @IsNumber({}, { message: 'La cantidad real debe ser un número' })
  @Min(0, { message: 'La cantidad real no puede ser negativa' })
  @Max(100000, { message: 'La cantidad real no puede exceder 100,000' })
  cant_real_desca?: number;

  @IsOptional() // Cambia a opcional
  @IsInt({ message: 'El ID del proveedor debe ser un número entero' })
  proveedor_id?: number; // Cambia a opcional

  @IsOptional()
  @ValidateNested()
  @Type(() => DetallesDto)
  detalles?: DetallesDto;
}
class UpdateRegistroDto {
  @IsNotEmpty({ message: 'La fecha es requerida' })
  @IsDate({ message: 'La fecha debe ser una fecha válida' })
  @Type(() => Date)
  fecha: Date;

  @IsNotEmpty({ message: 'Las placas de transporte son requeridas' })
  @IsString({ message: 'Las placas deben ser un texto' })
  @Matches(/^[A-Z0-9-]+$/, { message: 'Formato de placas inválido' })
  placas_transporte: string;

  @IsNotEmpty({ message: 'La variedad es requerida' })
  @IsString({ message: 'La variedad debe ser un texto' })
  variedad: string;

  @IsNotEmpty({ message: 'El destino es requerido' })
  @IsString({ message: 'El destino debe ser un texto' })
  destino: string;

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
  @Min(0, { message: 'La cantidad programada no puede ser negativa' })
  @Max(100000, { message: 'La cantidad programada no puede exceder 100,000' })
  cant_progra_desca?: number;

  @IsOptional()
  @IsNumber({}, { message: 'La cantidad real debe ser un número' })
  @Min(0, { message: 'La cantidad real no puede ser negativa' })
  @Max(100000, { message: 'La cantidad real no puede exceder 100,000' })
  cant_real_desca?: number;
}

export { CreateRegistroDto, DetallesDto, UpdateRegistroDto };
