import { IsInt, IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  USUARIO = 'usuario',
  GERENTE = 'gerente',
  SUPERVISOR = 'supervisor',
}

class ProfileDto {
  @IsInt({ message: 'El ID debe ser un número entero' })
  id: number;

  @IsNotEmpty({ message: 'El usuario es requerido' })
  @IsString({ message: 'El usuario debe ser un texto' })
  usuario: string;

  @IsNotEmpty({ message: 'El rol es requerido' })
  @IsEnum(UserRole, { message: 'Rol inválido' })
  rol: string;

  @IsOptional()
  @IsString({ message: 'El avatar debe ser un texto' })
  avatar?: string;

  @IsNotEmpty({ message: 'La fecha de creación es requerida' })
  createdAt: Date;

  @IsNotEmpty({ message: 'La fecha de actualización es requerida' })
  updatedAt: Date;
}

class FindUserDto {
  @IsNotEmpty({ message: 'El usuario es requerido' })
  @IsString({ message: 'El usuario debe ser un texto' })
  usuario: string;
}

export { ProfileDto, FindUserDto, UserRole };
