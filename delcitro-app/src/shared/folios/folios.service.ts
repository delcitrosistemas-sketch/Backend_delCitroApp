import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FoliosService {
  constructor(private prisma: PrismaService) {}

  // === Recepción de fruta ===
  async generarFolioRecepcionFruta(
    fruta: 'Naranja' | 'Toronja' | 'Limon' | 'Mandarina',
    organico = false,
  ) {
    const now = new Date();

    const year = now.getFullYear().toString().slice(-2);

    const mesMap = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
    const mes = mesMap[now.getMonth()];

    const count = await this.prisma.rEGISTRO_DESCARGA_FRUTA_PARA_PROCESO.count({
      where: {
        fecha: {
          gte: new Date(now.getFullYear(), now.getMonth(), 1),
          lt: new Date(now.getFullYear(), now.getMonth() + 1, 1),
        },
      },
    });

    const consecutivo = String(count + 1).padStart(3, '0');

    const sufijo = organico ? 'O' : '';

    return `${year}${mes}-${consecutivo}${sufijo}`;
  }

  // === Código de proceso ===
  async generarCodigoProceso() {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);

    const mesMap = ['EN', 'FB', 'MR', 'AB', 'MY', 'JN', 'JL', 'AG', 'SP', 'OC', 'NV', 'DC'];
    const mes = mesMap[now.getMonth()];

    const count = await this.prisma.rEGISTRO_DESCARGA_FRUTA_PARA_PROCESO.count();

    const consecutivo = String(count + 1).padStart(3, '0');

    return `PR${consecutivo}${mes}${year}`;
  }

  // === Folio producto terminado ===
  async generarFolioProductoTerminado(codigoProducto: string, temporada: string, org = false) {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);

    const mesMap = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
    const mes = mesMap[now.getMonth()];

    const count = await this.prisma.rEGISTRO_DESCARGA_FRUTA_PARA_PROCESO.count({
      where: {
        fecha: {
          gte: new Date(now.getFullYear(), 0, 1),
          lt: new Date(now.getFullYear() + 1, 0, 1),
        },
      },
    });

    if (org) {
      return `${codigoProducto} ORG ${year} ${count}`;
    }

    return `DC${year}${mes}-${count}`;
  }
}
