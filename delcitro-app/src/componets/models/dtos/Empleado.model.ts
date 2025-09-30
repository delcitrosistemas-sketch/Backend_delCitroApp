import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsInt,
  Min,
  Max,
  IsEnum,
} from 'class-validator';

enum GENEROS {
  MASCULINO = 'Masculino',
  FEMENINO = 'Femenino',
  OTRO = 'Otro',
}

enum STATUS_EMPLEADO {
  ACTIVO = 'Activo',
  INACTIVO = 'Inactivo',
  SUSPENDIDO = 'Suspendido',
  VACACIONES = 'Vacaciones',
}

class CreateEmpleadoDto {
  @IsNotEmpty({ message: 'El primer nombre es requerido' })
  @IsString({ message: 'El primer nombre debe ser texto' })
  primer_nombre: string;

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
  @IsEmail({}, { message: 'El correo debe tener formato válido' })
  correo?: string;

  @IsNotEmpty({ message: 'El teléfono es requerido' })
  @IsString({ message: 'El teléfono debe ser texto' })
  telefono: string;

  @IsOptional()
  @IsString({ message: 'La dirección debe ser texto' })
  direccion?: string;

  @IsOptional()
  @IsInt({ message: 'La edad debe ser un número entero' })
  @Min(18, { message: 'La edad mínima es 18 años' })
  @Max(80, { message: 'La edad máxima es 80 años' })
  edad?: number;

  @IsNotEmpty({ message: 'El género es requerido' })
  @IsEnum(GENEROS, { message: 'Género inválido' })
  genero: string;

  @IsOptional()
  @IsEnum(STATUS_EMPLEADO, { message: 'Status inválido' })
  status?: string;

  @IsNotEmpty({ message: 'El área es requerida' })
  @IsInt({ message: 'El ID del área debe ser un número entero' })
  area_id: number;

  @IsNotEmpty({ message: 'El departamento es requerido' })
  @IsInt({ message: 'El ID del departamento debe ser un número entero' })
  departamento_id: number;

  @IsNotEmpty({ message: 'El puesto es requerido' })
  @IsInt({ message: 'El ID del puesto debe ser un número entero' })
  puesto_id: number;

  @IsNotEmpty({ message: 'Los detalles son requeridos' })
  @IsInt({ message: 'El ID de detalles debe ser un número entero' })
  detalles_id: number;
}

class UpdateEmpleadoDto {
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
  @IsEmail({}, { message: 'El correo debe tener formato válido' })
  correo?: string;

  @IsOptional()
  @IsString({ message: 'El teléfono debe ser texto' })
  telefono?: string;

  @IsOptional()
  @IsString({ message: 'La dirección debe ser texto' })
  direccion?: string;

  @IsOptional()
  @IsInt({ message: 'La edad debe ser un número entero' })
  @Min(18, { message: 'La edad mínima es 18 años' })
  @Max(80, { message: 'La edad máxima es 80 años' })
  edad?: number;

  @IsOptional()
  @IsEnum(GENEROS, { message: 'Género inválido' })
  genero?: string;

  @IsOptional()
  @IsEnum(STATUS_EMPLEADO, { message: 'Status inválido' })
  status?: string;

  @IsOptional()
  @IsInt({ message: 'El ID del área debe ser un número entero' })
  area_id?: number;

  @IsOptional()
  @IsInt({ message: 'El ID del departamento debe ser un número entero' })
  departamento_id?: number;

  @IsOptional()
  @IsInt({ message: 'El ID del puesto debe ser un número entero' })
  puesto_id?: number;

  @IsOptional()
  @IsInt({ message: 'El ID de detalles debe ser un número entero' })
  detalles_id?: number;
}

class EmpleadoDto {
  @IsInt({ message: 'El ID debe ser un número entero' })
  id: number;

  @IsInt({ message: 'El número de empleado debe ser un número entero' })
  num_emp: number;

  @IsString({ message: 'El primer nombre debe ser texto' })
  primer_nombre: string;

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
  @IsEmail({}, { message: 'El correo debe tener formato válido' })
  correo?: string;

  @IsString({ message: 'El teléfono debe ser texto' })
  telefono: string;

  @IsOptional()
  @IsString({ message: 'La dirección debe ser texto' })
  direccion?: string;

  @IsOptional()
  @IsInt({ message: 'La edad debe ser un número entero' })
  edad?: number;

  @IsEnum(GENEROS, { message: 'Género inválido' })
  genero: string;

  @IsEnum(STATUS_EMPLEADO, { message: 'Status inválido' })
  status: string;

  @IsInt({ message: 'El ID del área debe ser un número entero' })
  area_id: number;

  @IsInt({ message: 'El ID del departamento debe ser un número entero' })
  departamento_id: number;

  @IsInt({ message: 'El ID del puesto debe ser un número entero' })
  puesto_id: number;

  @IsInt({ message: 'El ID de detalles debe ser un número entero' })
  detalles_id: number;

  createdAt: Date;
  updatedAt: Date;
}

class CreateDetallesEmpleadoDto {
  @IsNotEmpty({ message: 'La incidencia es requerida' })
  @IsInt({ message: 'El ID de incidencia debe ser un número entero' })
  incidencia_id: number;
}

class UpdateDetallesEmpleadoDto {
  @IsOptional()
  @IsInt({ message: 'El ID de incidencia debe ser un número entero' })
  incidencia_id?: number;
}

class DetallesEmpleadoDto {
  @IsInt({ message: 'El ID debe ser un número entero' })
  id: number;

  @IsInt({ message: 'El ID de incidencia debe ser un número entero' })
  incidencia_id: number;

  createdAt: Date;
  updatedAt: Date;
}

export {
  GENEROS,
  STATUS_EMPLEADO,
  CreateEmpleadoDto,
  UpdateEmpleadoDto,
  EmpleadoDto,
  CreateDetallesEmpleadoDto,
  UpdateDetallesEmpleadoDto,
  DetallesEmpleadoDto,
};
