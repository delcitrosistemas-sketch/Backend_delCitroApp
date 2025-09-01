import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProfileDto } from '../models/Usuario.model';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

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
    } });
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
}
