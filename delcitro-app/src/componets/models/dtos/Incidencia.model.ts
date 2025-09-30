import { IsString, IsNotEmpty, IsDate, IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class CreateIncidenciaDto {
  @IsNotEmpty({ message: 'El tipo de incidencia es requerido' })
  @IsString({ message: 'El tipo debe ser texto' })
  tipo: string;

  @IsNotEmpty({ message: 'La fecha es requerida' })
  @IsDate({ message: 'La fecha debe ser una fecha válida' })
  @Type(() => Date)
  fecha: Date;
}

class UpdateIncidenciaDto {
  @IsOptional()
  @IsString({ message: 'El tipo debe ser texto' })
  tipo?: string;

  @IsOptional()
  @IsDate({ message: 'La fecha debe ser una fecha válida' })
  @Type(() => Date)
  fecha?: Date;
}

class IncidenciaDto {
  @IsInt({ message: 'El ID debe ser un número entero' })
  id: number;

  @IsString({ message: 'El tipo debe ser texto' })
  tipo: string;

  @IsDate({ message: 'La fecha debe ser una fecha válida' })
  fecha: Date;

  createdAt: Date;
  updatedAt: Date;
}

export { CreateIncidenciaDto, UpdateIncidenciaDto, IncidenciaDto };
