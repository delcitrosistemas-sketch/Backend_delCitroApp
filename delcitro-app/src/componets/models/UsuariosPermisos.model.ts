export interface ModuloArea {
  moduloId: number;
  nombre: string;
  codigo: string;
  url: string;
  icono: string;
  permisos: ModuloPermisos;
}

export interface ModuloPermisos {
  crear: boolean;
  leer: boolean;
  actualizar: boolean;
  eliminar: boolean;
}

export interface AreaPermisos {
  areaId: number;
  areaName: string;
  areaCodigo: string | null;
  roleArea: string;
  modulos: ModuloArea[];
}

export interface UserPermissions {
  userId: number;
  globalRole: string;
  areas: AreaPermisos[];
}
