import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateRegistroEntradaFrutaDto,
  UpdateRegistroEntradaFrutaDto,
} from '../../../componets/models/dtos/RegEntradaFruta.model';
import { PrismaService } from '../../../prisma/prisma.service';
import { FoliosService } from '../../../shared/folios/folios.service';

@Injectable()
export class RegEntraFrutaService {
  constructor(
    private prisma: PrismaService,
    private folioService: FoliosService,
  ) {}

  async create(createRegistroEntradaFrutaDto: CreateRegistroEntradaFrutaDto) {
    const { detalles, proveedor_id, ...registroData } = createRegistroEntradaFrutaDto;

    const data: any = {
      ...registroData,
      proveedor: {
        connect: { id: proveedor_id },
      },
    };

    if (detalles) {
      const { muestra_id, ...detallesData } = detalles;

      data.detalles = {
        create: {
          ...detallesData,
          ...(muestra_id && {
            muestreo: {
              connect: { id: muestra_id },
            },
          }),
        },
      };
    }

    return await this.prisma.rEGISTRO_ENTRADA_FRUTA.create({
      data,
      include: {
        proveedor: true,
        detalles: {
          include: {
            muestreo: true,
          },
        },
      },
    });
  }

  async findAll() {
    return await this.prisma.rEGISTRO_ENTRADA_FRUTA.findMany({
      include: {
        proveedor: true,
        detalles: {
          include: {
            muestreo: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const registro = await this.prisma.rEGISTRO_ENTRADA_FRUTA.findUnique({
      where: { id },
      include: {
        proveedor: true,
        detalles: {
          include: {
            muestreo: true,
          },
        },
      },
    });

    if (!registro) {
      throw new NotFoundException(`Registro con ID ${id} no encontrado`);
    }

    return registro;
  }

  async findByFolio(folio: string) {
    const registro = await this.prisma.rEGISTRO_ENTRADA_FRUTA.findUnique({
      where: { folio },
      include: {
        proveedor: true,
        detalles: {
          include: {
            muestreo: true,
          },
        },
      },
    });

    if (!registro) {
      throw new NotFoundException(`Registro con folio ${folio} no encontrado`);
    }

    return registro;
  }

  async update(id: number, updateRegistroEntradaFrutaDto: UpdateRegistroEntradaFrutaDto) {
    const { detalles, proveedor_id, ...registroData } = updateRegistroEntradaFrutaDto;

    await this.findOne(id);

    const data: any = { ...registroData };

    if (proveedor_id !== undefined) {
      data.proveedor = {
        connect: { id: proveedor_id },
      };
    }

    if (detalles) {
      const existingRegistro = await this.prisma.rEGISTRO_ENTRADA_FRUTA.findUnique({
        where: { id },
        include: { detalles: true }
      });

      const { muestra_id, ...detallesData } = detalles;
      const detallesUpdateData: any = { ...detallesData };

      if (muestra_id !== undefined) {
        detallesUpdateData.muestreo = {
          connect: { id: muestra_id },
        };
      }

      if (existingRegistro?.detalles) {
        data.detalles = {
          update: detallesUpdateData
        };
      } else {
        data.detalles = {
          create: detallesUpdateData
        };
      }
    }

    return await this.prisma.rEGISTRO_ENTRADA_FRUTA.update({
      where: { id },
      data,
      include: {
        proveedor: true,
        detalles: {
          include: {
            muestreo: true,
          },
        },
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    const registro = await this.prisma.rEGISTRO_ENTRADA_FRUTA.findUnique({
      where: { id },
      include: { detalles: true },
    });

    if (registro?.detalles) {
      await this.prisma.dETALLES_REGISTRO_ENTRADA_FRUTA.delete({
        where: { id: registro.detalles.id },
      });
    }

    return await this.prisma.rEGISTRO_ENTRADA_FRUTA.delete({
      where: { id },
    });
  }
}
