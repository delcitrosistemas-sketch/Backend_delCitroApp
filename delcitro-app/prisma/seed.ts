import { PrismaClient, $Enums } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de base de datos...');
/*
  // --- ROLES ---
  const roles = await Promise.all(
    ['Admin', 'Supervisor', 'Empleado', 'Cliente'].map((rol) =>
      prisma.rOLES.create({ data: { rol } }),
    ),
  );
*/
  // --- AREAS ---
  const areas = await Promise.all(
    ['Producción', 'Ventas', 'Logística'].map((nombre) =>
      prisma.aREAS.create({ data: { nombre } }),
    ),
  );

  // --- DEPARTAMENTOS ---
  const departamentos = await Promise.all(
    ['Calidad', 'Mantenimiento', 'Recursos Humanos'].map((nombre) =>
      prisma.dEPARTAMENTOS.create({
        data: {
          nombre,
          area: { connect: { id: areas[Math.floor(Math.random() * areas.length)].id } }, // ✅ relación requerida
        },
      }),
    ),
  );

  // --- PUESTOS ---
  const puestos = await Promise.all(
    ['Operador', 'Supervisor', 'Gerente'].map((nombre) =>
      prisma.pUESTOS.create({ data: { nombre } }),
    ),
  );

  /*
  // --- USUARIOS ---
  for (let i = 0; i < 10; i++) {
    await prisma.uSUARIOS.create({
      data: {
        usuario: faker.internet.username(),
        rol: 'ADMIN', // ⚠️ cámbialo si tu enum ROLES_GENERALES es distinto
        hash: faker.internet.password(),
        avatar: faker.image.avatar(),
      },
    });
  }

  // --- CLIENTES ---
  for (let i = 0; i < 10; i++) {
    await prisma.cLIENTES.create({
      data: {
        primer_nombre: faker.person.firstName(),
        segundo_nombre: faker.person.firstName(),
        apellido_paterno: faker.person.lastName(),
        apellido_materno: faker.person.lastName(),
        correo: faker.internet.email(),
        telefono: faker.phone.number(),
        direccion: faker.location.streetAddress(),
        empresa: faker.company.name(),
      },
    });
  }

*/

  // --- INCIDENCIAS ---
  const incidencias: { id: number }[] = []; // ✅ tipado explícito
  for (let i = 0; i < 5; i++) {
    const inc = await prisma.iNCIDENCIAS.create({
      data: {
        tipo: faker.helpers.arrayElement(['Falta', 'Retardo', 'Permiso']),
        fecha: faker.date.recent(),
      },
    });
    incidencias.push(inc);
  }

  // --- DETALLES_EMPLEADO + EMPLEADOS ---
  for (let i = 0; i < 50; i++) {
    const detalle = await prisma.dETALLES_EMPLEADO.create({
      data: {
        incidencia_id:
          incidencias[Math.floor(Math.random() * incidencias.length)].id,
      },
    });

    await prisma.eMPLEADOS.create({
      data: {
        primer_nombre: faker.person.firstName(),
        segundo_nombre: faker.person.middleName(),
        apellido_paterno: faker.person.lastName(),
        apellido_materno: faker.person.lastName(),
        correo: faker.internet.email(),
        telefono: faker.phone.number(),
        direccion: faker.location.streetAddress(),
        edad: faker.number.int({ min: 20, max: 60 }),
        genero: faker.helpers.arrayElement<$Enums.GENEROS>([
          $Enums.GENEROS.MASCULINO,
          $Enums.GENEROS.FEMENINO,
        ]), // ✅ usamos enum de Prisma
        area_id: areas[Math.floor(Math.random() * areas.length)].id,
        departamento_id:
        departamentos[Math.floor(Math.random() * departamentos.length)].id,
        puesto_id: puestos[Math.floor(Math.random() * puestos.length)].id,
        detalles_id: detalle.id,
      },
    });
  }

  console.log('✅ Seed completado!');
}

main()
  .catch((e) => {
    console.error('❌ Error en el seed', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
