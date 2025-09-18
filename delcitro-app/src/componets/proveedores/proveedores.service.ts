import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProveedoresService {
  constructor(private prisma: PrismaService) {}

  async findAllNames() {
    const proveedores = await this.prisma.pROVEEDORES.findMany({
      select: {
        id: true,
        nombre: true,
      },
      orderBy: {
        nombre: 'asc',
      },
    });
    
    return proveedores.filter(pro => pro.nombre !== null);
  }
}
