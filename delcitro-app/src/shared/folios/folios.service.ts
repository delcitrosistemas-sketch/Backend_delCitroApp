import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaProcesoService } from 'src/prisma/proceso/prisma.proceso.service';

@Injectable()
export class FoliosService {
  constructor(
    private prisma: PrismaService,
    private prismaProceso: PrismaProcesoService,
  ) {}

  // === Recepción de fruta ===
  async generarFolioRecepcionFruta(fruta: string, organico = false) {
    const now = new Date();

    const year = now.getFullYear().toString().slice(-2);

    const mesMap = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
    const mes = mesMap[now.getMonth()];

    const count = await this.prismaProceso.rEGISTRO_PROCESO.count({
      where: {
        fecha: {
          gte: new Date(now.getFullYear(), now.getMonth(), 1),
          lt: new Date(now.getFullYear(), now.getMonth() + 1, 1),
        },
      },
    });

    const consecutivo = String(count + 1).padStart(3, '0');
    let letraFruta = '';
    if (fruta === 'Naranja' || fruta === 'Toronja' || fruta === 'Limon' || fruta === 'Mandarina') {
      letraFruta = fruta.charAt(0);
    }
    const sufijo = organico ? 'O' : '';

    return `${year}${mes}-${consecutivo}${letraFruta}${sufijo}`;
  }

  // === Código de proceso ===
  async generarCodigoProceso(): Promise<string> {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);

    const mesMap = ['EN', 'FB', 'MR', 'AB', 'MY', 'JN', 'JL', 'AG', 'SP', 'OC', 'NV', 'DC'];
    const mes = mesMap[now.getMonth()];

    try {
      const ultimoRegistro = await this.prismaProceso.rEGISTRO_PROCESO.findFirst({
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id_proceso: true,
        },
      });

      let consecutivo = 1;

      if (ultimoRegistro && ultimoRegistro.id_proceso) {
        const match = ultimoRegistro.id_proceso.match(/PR(\d+)([A-Z]{2})(\d{2})/);

        if (match && match[1]) {
          const ultimoConsecutivo = parseInt(match[1], 10);
          consecutivo = ultimoConsecutivo + 1;
        }
      }

      const consecutivoFormateado = String(consecutivo).padStart(3, '0');

      return `PR${consecutivoFormateado}${mes}${year}`;
    } catch (error) {
      throw new Error(`Error al generar código de proceso: ${error.message}`);
    }
  }

  // === Folio producto terminado ===
  async generarFolioProductoTerminado(codigoProducto: string, temporada: string, org = false) {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);

    const mesMap = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
    const mes = mesMap[now.getMonth()];

    const count = await this.prisma.rEGISTRO_DESCARGA_FRUTA.count({
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
