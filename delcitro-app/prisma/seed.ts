import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed para columnas estado y municipio...');

  const estados = ['Nuevo León', 'Sonora', 'Veracruz', 'Tamaulipas', 'San Luis Potosí'];
  const municipios = ['Montemorelos', 'Allende', 'Linares', 'Santiago', 'General Terán'];

  try {
    // 1. Obtener todos los registros existentes
    const detalles = await prisma.dETALLES_REGISTRO_DESCARGA_FRUTA_PARA_PROCESO.findMany();

    if (detalles.length === 0) {
      console.warn('⚠️ No hay registros en DETALLES_REGISTRO_DESCARGA_FRUTA_PARA_PROCESO para actualizar.');
      return;
    }

    console.log(`🔄 Actualizando ${detalles.length} registros...`);

    // 2. Actualizar cada registro
    for (const detalle of detalles) {
      const nuevoEstado = faker.helpers.arrayElement(estados);
      const nuevoMunicipio = faker.helpers.arrayElement(municipios);

      await prisma.dETALLES_REGISTRO_DESCARGA_FRUTA_PARA_PROCESO.update({
        where: { id: detalle.id },
        data: {
          estado: nuevoEstado,
          municipio: nuevoMunicipio,
        },
      });

      console.log(`✅ Registro ${detalle.id} actualizado: ${nuevoMunicipio}, ${nuevoEstado}`);
    }

    console.log('🎉 Actualización completada');
  } catch (error) {
    console.error('❌ Error durante el seed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error('❌ Error en main()', e);
  process.exit(1);
});
