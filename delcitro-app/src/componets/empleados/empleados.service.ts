import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateEmpleadoDto } from '../models/index.model';

@Injectable()
export class EmpleadosService {
  constructor(private prisma: PrismaService) {}

  private areaMap: Record<string, number> = {
    "Producción": 1,
    "Ventas": 2,
    "Logística": 3,
    "Tecnología": 4,
    "Marketing": 5,
    "Transporte": 6,
  };

  private departamentoMap: Record<string, number> = {
    "Mantenimiento": 1,
    "Recursos Humanos": 2,
    "Calidad": 3,
    "Sistemas": 4,
    "Finanzas": 5,
    "Mejora Continua": 6,
  };

  private puestoMap: Record<string, number> = {
    "Gerente": 1,
    "Supervisor": 2,
    "Operador": 3,
    "Apoyo": 4,
    "Limpieza": 5,
    "Chofer": 6,
  };

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
      },
    });

    return empleados.map((empleado) => ({
      id: empleado.id,
      num_emp: empleado.num_emp,
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
      createdAt: empleado.createdAt,
      updatedAt: empleado.updatedAt,
    };
  }

  async update(id: number, dto: UpdateEmpleadoDto) {
    await this.findOne(id);

    if (dto.area_id && typeof dto.area_id === 'string') {
      const areaId = this.areaMap[dto.area_id];
      if (!areaId) {
        throw new BadRequestException(`Área inválida: ${dto.area_id}`);
      }
      dto.area_id = areaId;
    }

    if (dto.departamento_id && typeof dto.departamento_id === 'string') {
      const deptoId = this.departamentoMap[dto.departamento_id];
      if (!deptoId) {
        throw new BadRequestException(`Departamento inválido: ${dto.departamento_id}`);
      }
      dto.departamento_id = deptoId;
    }

    if (dto.puesto_id && typeof dto.puesto_id === 'string') {
      const puestoId = this.puestoMap[dto.puesto_id];
      if (!puestoId) {
        throw new BadRequestException(`Puesto inválido: ${dto.puesto_id}`);
      }
      dto.puesto_id = puestoId;
    }

    const data: Prisma.EMPLEADOSUpdateInput = {
      primer_nombre: dto.primer_nombre,
      segundo_nombre: dto.segundo_nombre,
      apellido_paterno: dto.apellido_paterno,
      apellido_materno: dto.apellido_materno,
      correo: dto.correo,
      telefono: dto.telefono,
      direccion: dto.direccion,
      edad: dto.edad,
      genero: dto.genero as any,
      status: dto.status,
      updatedAt: new Date(),

      ...(dto.area_id && {
        area_asignada: { connect: { id: dto.area_id } },
      }),
      ...(dto.departamento_id && {
        departamento: { connect: { id: dto.departamento_id } },
      }),
      ...(dto.puesto_id && {
        puesto: { connect: { id: dto.puesto_id } },
      }),
    };

    return this.prisma.eMPLEADOS.update({
      where: { id },
      data,
    });
  }

  async darDeBaja(id: number) {
    await this.findOne(id);

    return this.prisma.eMPLEADOS.update({
      where: { id },
      data: {
        status: 'Inactivo',
        updatedAt: new Date(),
      },
    });
  }

  async reactivar(id: number) {
    await this.findOne(id);

    return this.prisma.eMPLEADOS.update({
      where: { id },
      data: {
        status: 'Activo',
        updatedAt: new Date(),
      },
    });
  }

  async areas() {
    const areas = await this.prisma.aREAS.findMany({
      select: {
        nombre: true,
      },
    });

    return areas.map((area) => area.nombre);
  }

  async departamentos() {
    const dep = await this.prisma.dEPARTAMENTOS.findMany({
      select: {
        nombre: true,
      },
    });

    return dep.map((dep) => dep.nombre);
  }

  async puestos() {
    const puesto = await this.prisma.pUESTOS.findMany({
      select: {
        nombre: true,
      },
    });

    return puesto.map((puesto) => puesto.nombre);
  }
}
