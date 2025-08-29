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

    // Mapeo manual para no devolver campos sensibles
    const profile: ProfileDto = {
      id: user.id,
      usuario: user.usuario,
      rol: user.rol,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return profile;
  }
}
