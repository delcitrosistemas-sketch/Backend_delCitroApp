import { IsString, IsNotEmpty, IsOptional, IsEmail, IsInt } from 'class-validator';

class CreateClienteDto {
  @IsNotEmpty({ message: 'El primer nombre es requerido' })
  @IsString({ message: 'El primer nombre debe ser texto' })
  primer_nombre: string;

  @IsNotEmpty({ message: 'El segundo nombre es requerido' })
  @IsString({ message: 'El segundo nombre debe ser texto' })
  segundo_nombre: string;

  @IsNotEmpty({ message: 'El apellido paterno es requerido' })
  @IsString({ message: 'El apellido paterno debe ser texto' })
  apellido_paterno: string;

  @IsNotEmpty({ message: 'El apellido materno es requerido' })
  @IsString({ message: 'El apellido materno debe ser texto' })
  apellido_materno: string;

  @IsNotEmpty({ message: 'El correo es requerido' })
  @IsEmail({}, { message: 'El correo debe tener un formato válido' })
  correo: string;

  @IsNotEmpty({ message: 'El teléfono es requerido' })
  @IsString({ message: 'El teléfono debe ser texto' })
  telefono: string;

  @IsNotEmpty({ message: 'La dirección es requerida' })
  @IsString({ message: 'La dirección debe ser texto' })
  direccion: string;

  @IsNotEmpty({ message: 'La empresa es requerida' })
  @IsString({ message: 'La empresa debe ser texto' })
  empresa: string;
}

class UpdateClienteDto {
  @IsOptional()
  @IsString({ message: 'El primer nombre debe ser texto' })
  primer_nombre?: string;

  @IsOptional()
  @IsString({ message: 'El segundo nombre debe ser texto' })
  segundo_nombre?: string;

  @IsOptional()
  @IsString({ message: 'El apellido paterno debe ser texto' })
  apellido_paterno?: string;

  @IsOptional()
  @IsString({ message: 'El apellido materno debe ser texto' })
  apellido_materno?: string;

  @IsOptional()
  @IsEmail({}, { message: 'El correo debe tener un formato válido' })
  correo?: string;

  @IsOptional()
  @IsString({ message: 'El teléfono debe ser texto' })
  telefono?: string;

  @IsOptional()
  @IsString({ message: 'La dirección debe ser texto' })
  direccion?: string;

  @IsOptional()
  @IsString({ message: 'La empresa debe ser texto' })
  empresa?: string;
}

class ClienteDto {
  @IsInt({ message: 'El ID debe ser un número entero' })
  id: number;

  @IsString({ message: 'El primer nombre debe ser texto' })
  primer_nombre: string;

  @IsString({ message: 'El segundo nombre debe ser texto' })
  segundo_nombre: string;

  @IsString({ message: 'El apellido paterno debe ser texto' })
  apellido_paterno: string;

  @IsString({ message: 'El apellido materno debe ser texto' })
  apellido_materno: string;

  @IsEmail({}, { message: 'El correo debe tener un formato válido' })
  correo: string;

  @IsString({ message: 'El teléfono debe ser texto' })
  telefono: string;

  @IsString({ message: 'La dirección debe ser texto' })
  direccion: string;

  @IsString({ message: 'La empresa debe ser texto' })
  empresa: string;

  createdAt: Date;
  updatedAt: Date;
}

export { ClienteDto, UpdateClienteDto, CreateClienteDto };
