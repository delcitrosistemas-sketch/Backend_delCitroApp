import { Injectable, NotFoundException } from '@nestjs/common';
import { format } from 'date-fns'; // Cambia esta importación
import { es } from 'date-fns/locale';
import { CreateRegistroDto } from 'src/componets/models/RegEntradaFruta.model';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RegEntraFrutaService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateRegistroDto) {
    return this.prisma.rEGISTRO_DESCARGA_FRUTA_PARA_PROCESO.create({
      data,
      include: {
        proveedor: true,
        detalles: {
          include: { muestreo: true },
        },
      },
    });
  }

  async findAll() {
    const registros = await this.prisma.rEGISTRO_DESCARGA_FRUTA_PARA_PROCESO.findMany({
      include: {
        proveedor: true,
        detalles: { include: { muestreo: true } },
      },
      orderBy: { fecha: 'desc' },
    });

    return registros.map((r) => ({
      ...r,
      fecha: format(new Date(r.fecha), 'dd/MM/yyyy', { locale: es }),
      inicio_descarga: r.inicio_descarga
        ? format(new Date(r.inicio_descarga), 'dd/MM/yyyy HH:mm', { locale: es })
        : null,
      fin_descarga: r.fin_descarga
        ? format(new Date(r.fin_descarga), 'dd/MM/yyyy HH:mm', { locale: es })
        : null,
      createdAt: format(new Date(r.createdAt), 'dd/MM/yyyy HH:mm', { locale: es }),
      updatedAt: format(new Date(r.updatedAt), 'dd/MM/yyyy HH:mm', { locale: es }),
    }));
  }

  async findOne(id: number) {
    const registro = await this.prisma.rEGISTRO_DESCARGA_FRUTA_PARA_PROCESO.findUnique({
      where: { id },
      include: {
        proveedor: true,
        detalles: { include: { muestreo: true } },
      },
    });

    if (!registro) throw new NotFoundException('Registro no encontrado');

    return {
      ...registro,
      fecha: format(new Date(registro.fecha), 'dd/MM/yyyy', { locale: es }),
      inicio_descarga: registro.inicio_descarga
        ? format(new Date(registro.inicio_descarga), 'dd/MM/yyyy HH:mm', { locale: es })
        : null,
      fin_descarga: registro.fin_descarga
        ? format(new Date(registro.fin_descarga), 'dd/MM/yyyy HH:mm', { locale: es })
        : null,
      createdAt: format(new Date(registro.createdAt), 'dd/MM/yyyy HH:mm', { locale: es }),
      updatedAt: format(new Date(registro.updatedAt), 'dd/MM/yyyy HH:mm', { locale: es }),
    };
  }

  async update(id: number, data: CreateRegistroDto) {
    await this.findOne(id);

    return this.prisma.rEGISTRO_DESCARGA_FRUTA_PARA_PROCESO.update({
      where: { id },
      data,
      include: {
        proveedor: true,
        detalles: { include: { muestreo: true } },
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.rEGISTRO_DESCARGA_FRUTA_PARA_PROCESO.delete({
      where: { id },
    });
  }
}
