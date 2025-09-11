import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

// Definir interfaces para los tipos
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

interface DetalleRegistro {
  id: number;
  bins: number | null;
  jaula: string | null;
  huerta: string | null;
  observaciones: string | null;
  createdAt: Date;
  updatedAt: Date;
}

async function main() {
  console.log('🌱 Iniciando seeding de datos de prueba...');

  // Limpiar datos existentes (en el orden correcto por las FK)
  await prisma.mUESTREOS.deleteMany();
  await prisma.rEGISTRO_DESCARGA_FRUTA_PARA_PROCESO.deleteMany();
  await prisma.dETALLES_REGISTRO_DESCARGA_FRUTA_PARA_PROCESO.deleteMany();
  await prisma.pROVEEDORES.deleteMany();

  console.log('🗑️ Datos antiguos eliminados');

  // Crear proveedores con tipo explícito
  const proveedores: Proveedor[] = [];
  for (let i = 0; i < 10; i++) {
    const proveedor = await prisma.pROVEEDORES.create({
      data: {
        nombre: faker.person.fullName(),
        empresa: faker.company.name(),
        direccion: faker.location.streetAddress(),
        estado: faker.location.state(),
        codigoPostal: faker.location.zipCode(),
        telefono: faker.phone.number(),
        email: faker.internet.email(),
      },
    });
    proveedores.push(proveedor);
    console.log(`✅ Proveedor creado: ${proveedor.empresa}`);
  }

  // Crear detalles de registro con tipo explícito
  const detallesRegistros: DetalleRegistro[] = [];
  for (let i = 0; i < 15; i++) {
    const detalle = await prisma.dETALLES_REGISTRO_DESCARGA_FRUTA_PARA_PROCESO.create({
      data: {
        bins: faker.number.int({ min: 20, max: 50 }),
        jaula: `JA-${faker.number.int({ min: 1000, max: 9999 })}`,
        huerta: `Huerta ${faker.location.city()}`,
        observaciones: faker.lorem.sentence(),
      },
    });
    detallesRegistros.push(detalle);
    console.log(`✅ Detalle de registro creado: ${detalle.jaula}`);
  }

  // Crear registros de descarga de fruta
  const variedades = ['Marrs', 'Temp', 'Valencia', 'Persa', 'Italiano', 'Mandarina', 'Toronja'];
  const destinos = ['LALA', 'Juge', 'IceGen', 'Conc', 'Emp'];

  for (let i = 0; i < 20; i++) {
    const proveedor = proveedores[Math.floor(Math.random() * proveedores.length)];
    const detalle = detallesRegistros[Math.floor(Math.random() * detallesRegistros.length)];
    const fecha = faker.date.recent({ days: 30 });

    const registro = await prisma.rEGISTRO_DESCARGA_FRUTA_PARA_PROCESO.create({
      data: {
        folio: `DESC-2025-${faker.number.int({ min: 1000, max: 9999 })}`,
        fecha: fecha,
        boleta: faker.number.int({ min: 10000, max: 99999 }),
        placas_transporte: `${faker.string.alpha(3).toUpperCase()}${faker.number.int({ min: 1000, max: 9999 })}`,
        variedad: variedades[Math.floor(Math.random() * variedades.length)],
        destino: destinos[Math.floor(Math.random() * destinos.length)],
        inicio_descarga: faker.date.between({ 
          from: fecha, 
          to: new Date(fecha.getTime() + 2 * 60 * 60 * 1000) 
        }),
        fin_descarga: faker.date.between({ 
          from: new Date(fecha.getTime() + 3 * 60 * 60 * 1000), 
          to: new Date(fecha.getTime() + 6 * 60 * 60 * 1000) 
        }),
        cant_progra_desca: faker.number.float({ min: 10000, max: 30000, fractionDigits: 2 }),
        cant_real_desca: faker.number.float({ min: 9500, max: 30500, fractionDigits: 2 }),
        proveedor_id: proveedor.id,
        detalles_id: detalle.id,
      },
    });
    console.log(`✅ Registro de descarga creado: ${registro.folio}`);
  }

  // Crear muestreos
  const estados = ['Nuevo Leon', 'Sonora', 'Veracruz', 'Tamaulipas', 'San Luis Potosi'];
  const ciudades = ['Montemorelos', 'Alllende', 'Linares', 'Santiago', 'General Teran'];
  const sabores = ['1', '2', '3', '4', 'Caracteristico'];
  const colores = ['34', '35', '36', '37', 'Caracteristico'];

  for (let i = 0; i < 15; i++) {
    const proveedor = proveedores[Math.floor(Math.random() * proveedores.length)];
    const fecha = faker.date.recent({ days: 60 });

    const muestreo = await prisma.mUESTREOS.create({
      data: {
        fecha: fecha,
        proveedor_id: proveedor.id,
        huertero: faker.person.fullName(),
        lote: `LOTE-${faker.number.int({ min: 100, max: 999 })}`,
        cuidad: ciudades[Math.floor(Math.random() * ciudades.length)],
        estado: estados[Math.floor(Math.random() * estados.length)],
        ton_aprox: faker.number.float({ min: 50, max: 200, fractionDigits: 1 }),
        bta: faker.number.float({ min: 8.0, max: 12.5, fractionDigits: 2 }),
        acidez: faker.number.float({ min: 0.8, max: 2.5, fractionDigits: 2 }),
        rto: faker.number.float({ min: 45, max: 65, fractionDigits: 1 }),
        rendimiento: faker.number.float({ min: 50, max: 85, fractionDigits: 1 }),
        sabor: sabores[Math.floor(Math.random() * sabores.length)],
        color: colores[Math.floor(Math.random() * colores.length)],
        aceite: faker.number.float({ min: 0.1, max: 0.8, fractionDigits: 3 }),
        observaciones: faker.lorem.sentence(),
        analizo: faker.person.fullName(),
      },
    });
    console.log(`✅ Muestreo creado: ${muestreo.lote}`);
  }

  console.log('🎉 Seeding completado exitosamente!');
  console.log(`📊 Resumen:`);
  console.log(`   - ${proveedores.length} proveedores creados`);
  console.log(`   - ${detallesRegistros.length} detalles de registro creados`);
  console.log(`   - 20 registros de descarga creados`);
  console.log(`   - 15 muestreos creados`);
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });