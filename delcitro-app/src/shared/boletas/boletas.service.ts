import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BoletasService {
  constructor(private prisma: PrismaService) {}

  // === Boleta A de Recepción de Fruta ===
  async generarBoletaRecepcionFruta(
    tipo:
      | 'LALA'
      | 'Concentrado'
      | 'Fresco'
      | 'Empacadora'
      | 'Maquila'
      | 'Otros'
      | 'Cascarilla'
      | 'Agua',
  ) {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);

    const mesMap = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
    const mes = mesMap[now.getMonth()];

    const count = await this.prisma.rEGISTRO_SALIDA_PRODUCTO_TERMINADO.count();

    const consecutivo = String(count + 1).padStart(3, '0');

    let codigo = '';

    switch (tipo) {
      case 'LALA':
        codigo = `L${year}${mes}-${consecutivo}`;
        break;
      case 'Concentrado':
        codigo = `C${year}${mes}-${consecutivo}`;
        break;
      case 'Fresco':
        codigo = `F${year}${mes}-${consecutivo}`;
        break;
      case 'Empacadora':
        codigo = `E${year}${mes}-${consecutivo}`;
        break;
      case 'Maquila':
        codigo = `M${year}${mes}-${consecutivo}`;
        break;
      case 'Otros':
        codigo = `O${year}${mes}-${consecutivo}`;
        break;
      case 'Cascarilla':
        codigo = `CS${year}${mes}-${consecutivo}`;
        break;
      case 'Agua':
        codigo = `A${year}${mes}-${consecutivo}`;
        break;
      default:
        codigo = `X${year}${mes}-${consecutivo}`;
        break;
    }

    return codigo;
  }
}
