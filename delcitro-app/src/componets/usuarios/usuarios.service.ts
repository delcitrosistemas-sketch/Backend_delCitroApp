import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProfileDto } from '../models/Usuario.model';

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

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
      avatar: user.avatar 
        ? `${backendUrl}/uploads/avatars/${user.avatar}`
        : null,
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
