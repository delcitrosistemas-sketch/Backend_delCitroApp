import { ROLES_AREA } from '@prisma/client';
import { IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
  @IsNotEmpty()
  @IsString()
  usuario: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class AssignAreaDto {
  @IsInt()
  @IsNotEmpty()
  areaId: number;

  @IsEnum(ROLES_AREA)
  @IsNotEmpty()
  rolArea: ROLES_AREA;
}

export interface AssignPermissionDto {
  areaId: number;
  rolArea: 'ADMINISTRADOR_AREA' | 'SUPERVISOR_AREA' | 'OPERADOR' | 'VISUALIZADOR';
}
