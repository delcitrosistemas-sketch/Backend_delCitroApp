import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EmpleadosService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.EMPLEADOSCreateInput) {
    return this.prisma.eMPLEADOS.create({
      data: {
        primer_nombre: data.primer_nombre,
        segundo_nombre: data.segundo_nombre,
        apellido_paterno: data.apellido_paterno,
        apellido_materno: data.apellido_materno,
        correo: data.correo,
        telefono: data.telefono,
        direccion: data.direccion,
        edad: data.edad,
        genero: data.genero,
        status: data.status || 'Activo',
        area_id: 1,
        departamento_id: 1,
        puesto_id: 1,
        detalles_id: 1,
      },
    });
  }

  async findAll() {
    const empleados = await this.prisma.eMPLEADOS.findMany({
      include: {
        area_asignada: true,
        departamento: true,
        puesto: true,
        detalles: {
          include: {
            incidencias: true,
          },
        },
      },
    });

    return empleados.map((empleado) => ({
      id: empleado.id,
      primer_nombre: empleado.primer_nombre,
      segundo_nombre: empleado.segundo_nombre,
      apellido_paterno: empleado.apellido_paterno,
      apellido_materno: empleado.apellido_materno,
      correo: empleado.correo,
      telefono: empleado.telefono,
      direccion: empleado.direccion,
      edad: empleado.edad,
      genero: empleado.genero,
      status: empleado.status,
      area_id: empleado.area_asignada?.nombre ?? null,
      departamento_id: empleado.departamento?.nombre ?? null,
      puesto_id: empleado.puesto?.nombre ?? null,
      detalles_id: empleado.detalles?.id ?? null,
      // opcional: puedes traer las incidencias en texto
      incidencias: empleado.detalles?.incidencias
        ? {
            tipo: empleado.detalles.incidencias.tipo,
            fecha: empleado.detalles.incidencias.fecha,
          }
        : null,
      createdAt: empleado.createdAt,
      updatedAt: empleado.updatedAt,
    }));
  }

  async findOne(id: number) {
    const empleado = await this.prisma.eMPLEADOS.findUnique({
      where: { id },
      include: {
        area_asignada: true,
        departamento: true,
        puesto: true,
        detalles: {
          include: { incidencias: true },
        },
      },
    });

    if (!empleado) throw new NotFoundException(`Empleado con id ${id} no encontrado`);

    return {
      id: empleado.id,
      primer_nombre: empleado.primer_nombre,
      segundo_nombre: empleado.segundo_nombre,
      apellido_paterno: empleado.apellido_paterno,
      apellido_materno: empleado.apellido_materno,
      correo: empleado.correo,
      telefono: empleado.telefono,
      direccion: empleado.direccion,
      edad: empleado.edad,
      genero: empleado.genero,
      status: empleado.status,
      area_id: empleado.area_asignada?.nombre ?? null,
      departamento_id: empleado.departamento?.nombre ?? null,
      puesto_id: empleado.puesto?.nombre ?? null,
      detalles_id: empleado.detalles?.id ?? null,
      incidencias: empleado.detalles?.incidencias
        ? {
            tipo: empleado.detalles.incidencias.tipo,
            fecha: empleado.detalles.incidencias.fecha,
          }
        : null,
      createdAt: empleado.createdAt,
      updatedAt: empleado.updatedAt,
    };
  }

  async update(id: number, data: Prisma.USUARIOSUpdateInput) {
    await this.findOne(id);
    return this.prisma.eMPLEADOS.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.eMPLEADOS.delete({ where: { id } });
  }
}
