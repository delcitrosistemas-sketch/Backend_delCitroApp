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
    const documentos = await this.prisma.dOCUMENTOS_SGC.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return documentos.map(doc => ({
      ...doc,
      createdAt: this.formatDate(doc.createdAt),
      updatedAt: this.formatDate(doc.updatedAt),
    }));
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
      distinct: ['tipo'],
    });

    return tipos.map((item) => item.tipo);
  }

  async findAllCategoriesCount() {
    const categoriasCount = await this.prisma.dOCUMENTOS_SGC.groupBy({
      by: ['tipo'],
      _count: {
        tipo: true,
      },
      orderBy: {
        tipo: 'asc',
      },
    });

    return categoriasCount.map((item) => ({
      tipo: item.tipo,
      count: item._count.tipo,
    }));
  }

  private formatDate(date: Date | string): string {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      if (isNaN(dateObj.getTime())) {
        return typeof date === 'string' ? date : date.toISOString();
      }

      const day = dateObj.getDate().toString().padStart(2, '0');
      const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
      const year = dateObj.getFullYear();

      return `${day}/${month}/${year}`;
    } catch (error) {
      return typeof date === 'string' ? date : date.toISOString();
    }
  }
}
