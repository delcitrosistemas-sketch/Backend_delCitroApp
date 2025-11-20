import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AdminChangePasswordDto, AuthDto } from './dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { Tokens } from './types';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signupLocal(dto: AuthDto): Promise<Tokens> {
    const hash = await this.hashData(dto.password);

    const newUser = await this.prisma.uSUARIOS.create({
      data: {
        usuario: dto.usuario,
        rol: 'USUARIO',
        hash,
      },
    });

    const tokens = await this.getTokens(newUser.id, newUser.usuario, newUser.rol);
    await this.updateRtHash(newUser.id, tokens.refresh_token);

    return tokens;
  }

  async signinLocal(dto: AuthDto): Promise<Tokens> {

    const user = await this.prisma.uSUARIOS.findUnique({
      where: {
        usuario: dto.usuario,
      },
      include: {
        permisos: {
          where: {
            activo: true,
          },
          include: {
            area: true,
            permisos_modulo: {
              include: {
                modulo: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new ForbiddenException('Usuario o contraseña incorrectos');
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.hash);

    if (!passwordMatches) {
      throw new ForbiddenException('Usuario o contraseña incorrectos');
    }

    const userPermissions = await this.getUserPermissions(user);

    const tokens = await this.getTokens(user.id, user.usuario, userPermissions);
    await this.updateRtHash(user.id, tokens.refresh_token);


    return tokens;
  }

   async getUserPermissions(user: any) {
    const permissions = {
      globalRole: user.rol,
      areas: user.permisos.map((permiso: any) => ({
        areaId: permiso.area_id,
        areaCodigo: permiso.area.codigo,
        areaNombre: permiso.area.nombre,
        rolArea: permiso.rol_area,
        modulos: permiso.permisos_modulo.map((pm: any) => ({
          codigo: pm.modulo.codigo,
          nombre: pm.modulo.nombre,
          permisos: {
            leer: pm.puede_leer,
            crear: pm.puede_crear,
            actualizar: pm.puede_actualizar,
            eliminar: pm.puede_eliminar,
          },
        })),
      })),
    };

    return permissions;
  }

  async logout(user: number) {
    await this.prisma.uSUARIOS.updateMany({
      where: {
        id: user,
        hashedRt: {
          not: null,
        },
      },
      data: {
        hashedRt: null,
      },
    });
  }

  async refreshTokens(userId: number, rt: string) {
    const user = await this.prisma.uSUARIOS.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user || !user.hashedRt) throw new ForbiddenException('Access Denied');

    const rtMatches = await bcrypt.compare(rt, user.hashedRt);
    if (!rtMatches) throw new ForbiddenException('Access Denied');
  }

  async updateRtHash(userId: number, rt: string) {
    const hash = await this.hashData(rt);

    await this.prisma.uSUARIOS.update({
      where: {
        id: userId,
      },
      data: {
        hashedRt: hash,
      },
    });
  }

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async getTokens(userId: number, usuario: string, userPermissions: any) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          usuario,
          permissions: userPermissions,
        },
        {
          secret: 'at-secret',
          expiresIn: 60 * 60 * 2,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          usuario,
        },
        {
          secret: 'rt-secret',
          expiresIn: 60 * 60 * 2,
        },
      ),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async adminChangePassword(
    adminUserId: number,
    dto: AdminChangePasswordDto,
  ): Promise<{ message: string }> {
    const adminUser = await this.prisma.uSUARIOS.findUnique({
      where: { id: adminUserId },
    });

    if (!adminUser) {
      throw new NotFoundException('Usuario administrador no encontrado');
    }

    if (dto.newPassword.length < 4) {
      throw new BadRequestException('La nueva contraseña debe tener al menos 5 caracteres');
    }

    const targetUser = await this.prisma.uSUARIOS.findUnique({
      where: { id: dto.userId },
    });

    if (!targetUser) {
      throw new NotFoundException('Usuario objetivo no encontrado');
    }

    const newHash = await this.hashData(dto.newPassword);

    await this.prisma.uSUARIOS.update({
      where: { id: dto.userId },
      data: {
        hash: newHash,
        hashedRt: null,
        updatedAt: new Date(),
      },
    });

    return { message: `Contraseña actualizada exitosamente para el usuario ${targetUser.usuario}` };
  }
}
