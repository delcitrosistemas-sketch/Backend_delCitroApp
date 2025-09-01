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
    } });
  }

  async findAll() {
    return this.prisma.eMPLEADOS.findMany();
  }

  async findOne(id: number) {
    const emp = await this.prisma.eMPLEADOS.findUnique({ where: { id } });
    if (!emp) throw new NotFoundException(`Empleado con id ${id} no encontrado`);
    return emp;
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
