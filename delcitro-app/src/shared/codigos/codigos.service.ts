import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CodigosService {
  constructor(private prisma: PrismaService) {}

  // === Código para producto terminado ===
  async generarCodigoProceso(codigoProducto: string) {
    const now = new Date();
    const year = now.getFullYear().toString();

    const count = await this.prisma.rEGISTRO_DESCARGA_FRUTA.count({
      where: {
        fecha: {
          gte: new Date(now.getFullYear(), now.getMonth(), 1),
          lt: new Date(now.getFullYear(), now.getMonth() + 1, 1),
        },
      },
    });

    const consecutivo = String(count + 1).padStart(3, '0');

    codigoProducto.toUpperCase();

    return `${year}${codigoProducto}${consecutivo}`;
  }
}
