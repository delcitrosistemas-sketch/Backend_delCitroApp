import {
  IsBoolean,
  IsInt,
  IsString,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

class ModuloPermisos {
  @IsBoolean({ message: 'Permiso crear debe ser booleano' })
  crear: boolean;

  @IsBoolean({ message: 'Permiso leer debe ser booleano' })
  leer: boolean;

  @IsBoolean({ message: 'Permiso actualizar debe ser booleano' })
  actualizar: boolean;

  @IsBoolean({ message: 'Permiso eliminar debe ser booleano' })
  eliminar: boolean;
}

class ModuloArea {
  @IsInt({ message: 'El ID del módulo debe ser un número entero' })
  moduloId: number;

  @IsNotEmpty({ message: 'El nombre del módulo es requerido' })
  @IsString({ message: 'El nombre del módulo debe ser un texto' })
  nombre: string;

  @IsNotEmpty({ message: 'El código del módulo es requerido' })
  @IsString({ message: 'El código del módulo debe ser un texto' })
  codigo: string;

  @IsNotEmpty({ message: 'La URL del módulo es requerida' })
  @IsString({ message: 'La URL del módulo debe ser un texto' })
  url: string;

  @IsNotEmpty({ message: 'El ícono del módulo es requerido' })
  @IsString({ message: 'El ícono del módulo debe ser un texto' })
  icono: string;

  @ValidateNested()
  @Type(() => ModuloPermisos)
  permisos: ModuloPermisos;
}

class AreaPermisos {
  @IsInt({ message: 'El ID del área debe ser un número entero' })
  areaId: number;

  @IsNotEmpty({ message: 'El nombre del área es requerido' })
  @IsString({ message: 'El nombre del área debe ser un texto' })
  areaName: string;

  @IsOptional()
  @IsString({ message: 'El código del área debe ser un texto' })
  areaCodigo: string | null;

  @IsNotEmpty({ message: 'El rol del área es requerido' })
  @IsString({ message: 'El rol del área debe ser un texto' })
  roleArea: string;

  @IsArray({ message: 'Los módulos deben ser un array' })
  @ValidateNested({ each: true })
  @Type(() => ModuloArea)
  modulos: ModuloArea[];
}

class UserPermissions {
  @IsInt({ message: 'El ID del usuario debe ser un número entero' })
  userId: number;

  @IsNotEmpty({ message: 'El rol global es requerido' })
  @IsString({ message: 'El rol global debe ser un texto' })
  globalRole: string;

  @IsArray({ message: 'Las áreas deben ser un array' })
  @ValidateNested({ each: true })
  @Type(() => AreaPermisos)
  areas: AreaPermisos[];
}

export { ModuloPermisos, ModuloArea, AreaPermisos, UserPermissions };
