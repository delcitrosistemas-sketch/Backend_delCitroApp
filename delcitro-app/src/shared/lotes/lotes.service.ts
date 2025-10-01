import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LotesService {
  constructor(private prisma: PrismaService) {}

  async generarLoteProductoTerminado(codigoProducto: string, isLocal?: boolean) {
    const now = new Date();
    const temporada = (parseInt(now.getFullYear().toString()) + 400).toString();
    let prefix = 'DEL';

    const count = await this.prisma.rEGISTRO_DESCARGA_FRUTA_PARA_PROCESO.count({
      where: {
        fecha: {
          gte: new Date(now.getFullYear(), 0, 1),
          lt: new Date(now.getFullYear() + 1, 0, 1),
        },
      },
    });

    const consecutivo = String(count + 1).padStart(3, '0');

    codigoProducto.toUpperCase();

    if (isLocal === true) {
      prefix = 'PPR';
    }

    return `${prefix}${codigoProducto}${temporada}${consecutivo}`;
  }

  async generarLoteProductoOrganico(codigoProducto: string) {
    const now = new Date();
    const temporada = now.getFullYear().toString().slice(-2);

    const count = await this.prisma.rEGISTRO_DESCARGA_FRUTA_PARA_PROCESO.count({
      where: {
        fecha: {
          gte: new Date(now.getFullYear(), now.getMonth(), 1),
          lt: new Date(now.getFullYear(), now.getMonth() + 1, 1),
        },
      },
    });

    const consecutivo = String(count + 1).padStart(3, '0');

    codigoProducto.toUpperCase();

    return `${codigoProducto}ORG${temporada}${consecutivo}`;
  }

  // Boleta de Producto Terminado para PRODALIM
  async generarLoteProdalimJugoNaranjaConcentrado() {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);

    const count = await this.prisma.rEGISTRO_DESCARGA_FRUTA_PARA_PROCESO.count({
      where: {
        fecha: {
          gte: new Date(now.getFullYear(), now.getMonth(), 1),
          lt: new Date(now.getFullYear(), now.getMonth() + 1, 1),
        },
      },
    });

    const consecutivo = String(count + 1).padStart(3, '0');

    return `${consecutivo}FCOJ${year}-PR-D`;
  }

  async generarLoteProdalimAceiteEsencialNaranja() {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);

    const count = await this.prisma.rEGISTRO_DESCARGA_FRUTA_PARA_PROCESO.count({
      where: {
        fecha: {
          gte: new Date(now.getFullYear(), now.getMonth(), 1),
          lt: new Date(now.getFullYear(), now.getMonth() + 1, 1),
        },
      },
    });

    const consecutivo = String(count + 1).padStart(3, '0');

    return `${consecutivo}00${year}-PR-D`;
  }
}
