import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import dayjs from 'dayjs';
import { Prisma } from '@prisma/client';

@Injectable()
export class MuestreosService {
  constructor(private prisma: PrismaService) {}

  private mapMuestreo(muestreo: any) {
    return {
      ...muestreo,
      fecha: dayjs(muestreo.fecha).format('DD/MM/YYYY'),
      createdAt: dayjs(muestreo.createdAt).format('DD/MM/YYYY'),
      updatedAt: dayjs(muestreo.updatedAt).format('DD/MM/YYYY'),
    };
  }

  async findAll() {
    const muestreos = await this.prisma.mUESTREOS.findMany({
      include: {
        registro: true,
      },
      orderBy: {
        fecha: 'desc',
      },
    });

    return muestreos.map((m) => this.mapMuestreo(m));
  }

  async findOne(id: number) {
    const muestreo = await this.prisma.mUESTREOS.findUnique({
      where: { id },
      include: {
        registro: true,
      },
    });

    if (!muestreo) {
      throw new NotFoundException(`Muestreo con id ${id} no encontrado`);
    }

    return this.mapMuestreo(muestreo);
  }

  async create(data: Prisma.MUESTREOSCreateInput) {
    const newMuestreo = await this.prisma.mUESTREOS.create({
      data,
      include: {
        registro: true,
      },
    });

    return this.mapMuestreo(newMuestreo);
  }

  async update(id: number, data: Prisma.MUESTREOSUpdateInput) {
    await this.findOne(id);

    const updated = await this.prisma.mUESTREOS.update({
      where: { id },
      data,
      include: {
        registro: true,
      },
    });

    return this.mapMuestreo(updated);
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.prisma.mUESTREOS.delete({
      where: { id },
    });

    return { message: `Muestreo con id ${id} eliminado correctamente` };
  }
}
