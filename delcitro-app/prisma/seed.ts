import { PrismaClient, $Enums, INCIDENCIAS } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

// Interfaces para los tipos
interface Proveedor {
  id: number;
  nombre: string | null;
  empresa: string;
  direccion: string | null;
  estado: string;
  codigoPostal: string | null;
  pais: string;
  telefono: string;
  email: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface Muestreo {
  id: number;
  fecha: Date;
  proveedor_id: number;
  huertero: string | null;
  lote: string;
  ciudad: string;
  estado: string;
  ton_aprox: number | null;
  bta: number;
  acidez: number;
  rto: number;
  rendimiento: number;
  sabor: string;
  color: string;
  aceite: number | null;
  observaciones: string | null;
  analizo: string;
  createdAt: Date;
  updatedAt: Date;
}

interface DetalleRegistro {
  id: number;
  bins: number | null;
  jaula: string | null;
  huerta: string | null;
  observaciones: string | null;
  muestra_id: number | null;
  createdAt: Date;
  updatedAt: Date;
}

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  try {
    // 3. Crear muestreos
    const muestreos: Muestreo[] = [];
    const estados = ['Nuevo Leon', 'Sonora', 'Veracruz', 'Tamaulipas', 'San Luis Potosi'];
    const ciudades = ['Montemorelos', 'Alllende', 'Linares', 'Santiago', 'General Teran'];
    const sabores = ['1', '2', '3', '4', 'Caracteristico'];
    const colores = ['34', '35', '36', '37', 'Caracteristico'];
    const variedades = ['Marrs', 'Temp', 'Valencia', 'Persa', 'Italiano', 'Mandarina', 'Toronja'];
    const destinos = ['LALA', 'Juge', 'IceGen', 'Conc', 'Emp'];

    for (let i = 0; i < 20; i++) {
      const muestreo = await prisma.mUESTREOS.create({
        data: {
          fecha: faker.date.recent({ days: 60 }),
          proveedor_id: faker.number.int({ min: 1, max: 10 }),
          huertero: faker.person.fullName(),
          lote: `LOTE-${faker.number.int({ min: 100, max: 999 })}`,
          ciudad: faker.helpers.arrayElement(ciudades),
          estado: faker.helpers.arrayElement(estados),
          ton_aprox: faker.number.float({ min: 50, max: 200, fractionDigits: 1 }),
          bta: faker.number.float({ min: 8.0, max: 12.5, fractionDigits: 2 }),
          acidez: faker.number.float({ min: 0.8, max: 2.5, fractionDigits: 2 }),
          rto: faker.number.float({ min: 45, max: 65, fractionDigits: 1 }),
          rendimiento: faker.number.float({ min: 50, max: 85, fractionDigits: 1 }),
          sabor: faker.helpers.arrayElement(sabores),
          color: faker.helpers.arrayElement(colores),
          aceite: faker.number.float({ min: 0.1, max: 0.8, fractionDigits: 3 }),
          observaciones: faker.lorem.sentence(),
          analizo: faker.person.fullName(),
        },
      });
      muestreos.push(muestreo);
      console.log(`✅ Muestreo creado: ${muestreo.lote}`);
    }

    // 4. Crear detalles de registro
    const detallesRegistros: DetalleRegistro[] = [];

    for (let i = 0; i < 30; i++) {
      const detalle = await prisma.dETALLES_REGISTRO_DESCARGA_FRUTA_PARA_PROCESO.create({
        data: {
          bins: faker.number.int({ min: 20, max: 50 }),
          jaula: `JA-${faker.number.int({ min: 1000, max: 9999 })}`,
          huerta: `Huerta ${faker.location.city()}`,
          observaciones: faker.lorem.sentence(),
          muestra_id: faker.helpers.maybe(
            () => muestreos[Math.floor(Math.random() * muestreos.length)].id,
            { probability: 0.7 },
          ),
        },
      });
      detallesRegistros.push(detalle);
      console.log(`✅ Detalle de registro creado: ${detalle.jaula}`);
    }

    // 5. Crear registros de descarga de fruta

    for (let i = 0; i < 40; i++) {
      const detalle = detallesRegistros[Math.floor(Math.random() * detallesRegistros.length)];
      const fecha = faker.date.recent({ days: 30 });

      const registro = await prisma.rEGISTRO_DESCARGA_FRUTA_PARA_PROCESO.create({
        data: {
          folio: `DESC-2024-${faker.number.int({ min: 1000, max: 9999 })}`,
          fecha: fecha,
          boleta: faker.number.int({ min: 10000, max: 99999 }),
          placas_transporte: `${faker.string.alpha(3).toUpperCase()}${faker.number.int({ min: 1000, max: 9999 })}`,
          variedad: faker.helpers.arrayElement(variedades),
          destino: faker.helpers.arrayElement(destinos),
          inicio_descarga: faker.date.between({
            from: fecha,
            to: new Date(fecha.getTime() + 2 * 60 * 60 * 1000),
          }),
          fin_descarga: faker.date.between({
            from: new Date(fecha.getTime() + 3 * 60 * 60 * 1000),
            to: new Date(fecha.getTime() + 6 * 60 * 60 * 1000),
          }),
          cant_progra_desca: faker.number.float({ min: 10000, max: 30000, fractionDigits: 2 }),
          cant_real_desca: faker.number.float({ min: 9500, max: 30500, fractionDigits: 2 }),
          proveedor_id: faker.number.int({ min: 1, max: 10 }),
          detalles_id: detalle.id,
        },
        include: {
          proveedor: true,
          detalles: {
            include: {
              muestreo: true,
            },
          },
        },
      });
      console.log(`✅ Registro de descarga creado: ${registro.folio}`);
    }

    console.log('🎉 Seed de registro de descarga completado exitosamente!');
    console.log('📊 Resumen:');
    console.log(`   - ${muestreos.length} muestreos creados`);
    console.log(`   - ${detallesRegistros.length} detalles de registro creados`);
    console.log(`   - 40 registros de descarga creados`);
  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error('❌ Error en el seed', e);
    process.exit(1);
  });