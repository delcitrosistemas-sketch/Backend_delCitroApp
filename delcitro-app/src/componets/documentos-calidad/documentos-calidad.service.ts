import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class DocumentosCalidadService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.DOCUMENTOS_SGCCreateInput) {
    return this.prisma.dOCUMENTOS_SGC.create({ data });
  }

  async findAll() {
    return this.prisma.dOCUMENTOS_SGC.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const doc = await this.prisma.dOCUMENTOS_SGC.findUnique({ where: { id } });
    if (!doc) throw new NotFoundException(`Documento ${id} no encontrado`);
    return doc;
  }

  async update(id: number, data: Prisma.DOCUMENTOS_SGCUpdateInput) {
    return this.prisma.dOCUMENTOS_SGC.update({ where: { id }, data });
  }

  async remove(id: number) {
    return this.prisma.dOCUMENTOS_SGC.delete({ where: { id } });
  }

  async findAllCategories() {
    const tipos = await this.prisma.dOCUMENTOS_SGC.findMany({
      select: {
        tipo: true,
      },
      distinct: ['tipo'], // 👈 Esto elimina duplicados
    });

    return tipos.map((item) => item.tipo);
  }
}
