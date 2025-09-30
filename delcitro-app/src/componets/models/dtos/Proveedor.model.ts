import { IsString, IsNotEmpty, IsOptional, IsEmail, IsInt } from 'class-validator';

class CreateProveedorDto {
  @IsOptional()
  @IsString({ message: 'El nombre debe ser texto' })
  nombre?: string;

  @IsNotEmpty({ message: 'La empresa es requerida' })
  @IsString({ message: 'La empresa debe ser texto' })
  empresa: string;

  @IsOptional()
  @IsString({ message: 'La dirección debe ser texto' })
  direccion?: string;

  @IsNotEmpty({ message: 'El estado es requerido' })
  @IsString({ message: 'El estado debe ser texto' })
  estado: string;

  @IsOptional()
  @IsString({ message: 'El código postal debe ser texto' })
  codigoPostal?: string;

  @IsOptional()
  @IsString({ message: 'El país debe ser texto' })
  pais?: string;

  @IsNotEmpty({ message: 'El teléfono es requerido' })
  @IsString({ message: 'El teléfono debe ser texto' })
  telefono: string;

  @IsOptional()
  @IsEmail({}, { message: 'El email debe tener formato válido' })
  email?: string;
}

class UpdateProveedorDto {
  @IsOptional()
  @IsString({ message: 'El nombre debe ser texto' })
  nombre?: string;

  @IsOptional()
  @IsString({ message: 'La empresa debe ser texto' })
  empresa?: string;

  @IsOptional()
  @IsString({ message: 'La dirección debe ser texto' })
  direccion?: string;

  @IsOptional()
  @IsString({ message: 'El estado debe ser texto' })
  estado?: string;

  @IsOptional()
  @IsString({ message: 'El código postal debe ser texto' })
  codigoPostal?: string;

  @IsOptional()
  @IsString({ message: 'El país debe ser texto' })
  pais?: string;

  @IsOptional()
  @IsString({ message: 'El teléfono debe ser texto' })
  telefono?: string;

  @IsOptional()
  @IsEmail({}, { message: 'El email debe tener formato válido' })
  email?: string;
}

class ProveedorDto {
  @IsInt({ message: 'El ID debe ser un número entero' })
  id: number;

  @IsOptional()
  @IsString({ message: 'El nombre debe ser texto' })
  nombre?: string;

  @IsString({ message: 'La empresa debe ser texto' })
  empresa: string;

  @IsOptional()
  @IsString({ message: 'La dirección debe ser texto' })
  direccion?: string;

  @IsString({ message: 'El estado debe ser texto' })
  estado: string;

  @IsOptional()
  @IsString({ message: 'El código postal debe ser texto' })
  codigoPostal?: string;

  @IsString({ message: 'El país debe ser texto' })
  pais: string;

  @IsString({ message: 'El teléfono debe ser texto' })
  telefono: string;

  @IsOptional()
  @IsEmail({}, { message: 'El email debe tener formato válido' })
  email?: string;

  createdAt: Date;
  updatedAt: Date;
}

export { CreateProveedorDto, ProveedorDto, UpdateProveedorDto };
