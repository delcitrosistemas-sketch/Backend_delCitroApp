import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProfileDto } from '../models/Usuario.model';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { ModuloArea, UserPermissions } from 'src/componets/models/UsuariosPermisos.model';
import { ROLES_AREA } from '@prisma/client';
@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.USUARIOSCreateInput) {
    const hashedPassword = await bcrypt.hash(data.hash, 10);
    return this.prisma.uSUARIOS.create({
      data: {
        usuario: data.usuario,
        rol: data.rol || 'USUARIO',
        hash: hashedPassword || '',
        hashedRt: data.hashedRt || '',
        avatar: data.avatar || '',
      },
    });
  }

  async findAll() {
    return this.prisma.uSUARIOS.findMany();
  }

  async findOne(id: number) {
    const user = await this.prisma.uSUARIOS.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    return user;
  }

  async update(id: number, data: Prisma.USUARIOSUpdateInput) {
    await this.findOne(id); // Valida existencia
    return this.prisma.uSUARIOS.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.uSUARIOS.delete({ where: { id } });
  }

  async infoUserProfile(usuario: string): Promise<ProfileDto | null> {
    const user = await this.prisma.uSUARIOS.findUnique({
      where: { usuario },
    });

    if (!user) return null;

    const profile: ProfileDto = {
      id: user.id,
      usuario: user.usuario,
      rol: user.rol,
      avatar: user.avatar || '',
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return profile;
  }

  async infoUserProfileById(userId: number) {
    console.log('Service perfil');
    const user = await this.prisma.uSUARIOS.findUnique({
      where: { id: userId },
      select: { id: true, usuario: true, rol: true, avatar: true },
    });

    if (!user) return null;

    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001';

    return {
      ...user,
      avatar: user.avatar ? `${backendUrl}/uploads/avatars/${user.avatar}` : null,
    };
  }

  async updateAvatar(userId: number, filename: string) {
    return this.prisma.uSUARIOS.update({
      where: { id: userId },
      data: {
        avatar: filename,
      },
    });
  }

  async getUserPermissions(userId: number): Promise<UserPermissions> {
    const user = await this.prisma.uSUARIOS.findUnique({
      where: { id: userId },
      include: {
        permisos: {
          where: { activo: true },
          include: {
            area: {
              include: {
                modulos: {
                  where: { activo: true },
                  include: {
                    permisos: true,
                  },
                  orderBy: { orden: 'asc' },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const userPermissions: UserPermissions = {
      userId: user.id,
      globalRole: user.rol,
      areas: [],
    };

    for (const permiso of user.permisos) {
      const area = permiso.area;
      const modulos: ModuloArea[] = [];

      for (const modulo of area.modulos) {
        const permisoModulo = modulo.permisos.find((p) => p.rol_area === permiso.rol_area);

        if (permisoModulo) {
          modulos.push({
            moduloId: modulo.id,
            nombre: modulo.nombre,
            codigo: modulo.codigo,
            url: modulo.url || '#',
            icono: modulo.icono || 'Circle',
            permisos: {
              crear: permisoModulo.puede_crear,
              leer: permisoModulo.puede_leer,
              actualizar: permisoModulo.puede_actualizar,
              eliminar: permisoModulo.puede_eliminar,
            },
          });
        }
      }

      userPermissions.areas.push({
        areaId: area.id,
        areaName: area.nombre,
        areaCodigo: area.codigo,
        roleArea: permiso.rol_area,
        modulos,
      });
    }

    return userPermissions;
  }

  async assignUserToArea(userId: number, areaId: number, rolArea: ROLES_AREA) {
    return this.prisma.uSUARIOS_PERMISOS.upsert({
      where: {
        usuario_id_area_id: {
          usuario_id: userId,
          area_id: areaId,
        },
      },
      update: {
        rol_area: rolArea,
        activo: true,
        updatedAt: new Date(),
      },
      create: {
        usuario_id: userId,
        area_id: areaId,
        rol_area: rolArea,
        activo: true,
      },
    });
  }

  async removeUserFromArea(userId: number, areaId: number) {
    return this.prisma.uSUARIOS_PERMISOS.updateMany({
      where: {
        usuario_id: userId,
        area_id: areaId,
      },
      data: {
        activo: false,
        updatedAt: new Date(),
      },
    });
  }

  async hasPermission(
    userId: number,
    areaCode: string,
    moduleCode: string,
    action: 'crear' | 'leer' | 'actualizar' | 'eliminar',
  ): Promise<boolean> {
    const permissions = await this.getUserPermissions(userId);

    const area = permissions.areas.find((a) => a.areaCodigo === areaCode);
    if (!area) return false;

    const modulo = area.modulos.find((m) => m.codigo === moduleCode);
    if (!modulo) return false;

    return modulo.permisos[action];
  }

  async canAccessArea(userId: number, areaCode: string): Promise<boolean> {
    const permissions = await this.getUserPermissions(userId);
    return permissions.areas.some((a) => a.areaCodigo === areaCode);
  }

  async getAreas() {
    return this.prisma.aREAS.findMany({
      where: { activo: true },
      select: {
        id: true,
        nombre: true,
        codigo: true,
      },
      orderBy: { nombre: 'asc' },
    });
  }

  async getAreasWithModules() {
    return this.prisma.aREAS.findMany({
      where: { activo: true },
      include: {
        modulos: {
          where: { activo: true },
          orderBy: { orden: 'asc' },
          select: {
            id: true,
            nombre: true,
            codigo: true,
            url: true,
            icono: true,
            orden: true,
          },
        },
      },
      orderBy: { nombre: 'asc' },
    });
  }
}
