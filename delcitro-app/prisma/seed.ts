import { PrismaClient, TipoProceso, Status_Proceso, RESPUESTA_FORMULARIOS } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

// Datos de referencia
const VARIEDADES = ['Naranja', 'Toronja', 'Limon', 'Mandarina', 'Lima'];
const DESTINOS = ['Juge', 'LALA', 'Emp', 'MAQ', 'Conc'];
const PROVEEDORES_NOMBRES = [
  'Citricos del Norte',
  'Huerta San Miguel',
  'Ricardo Tamez',
  'Manuel Varocio',
  'Raul Aguilera',
  'Arturo Garza',
  'PRODALIM',
];
const PRODUCTOS_DETERGENTE = [
  'Biodet Plus',
  'EcoClean',
  'CitroClean',
  'Industrial Soap',
  'Green Clean',
];
const LINEAS_TRANSPORTE = ['Aflecsa', 'Logística Express', 'Citro Transport', 'Carga Rápida'];

// Utilidades
function generarIdProceso(): string {
  const fecha = new Date();
  const year = fecha.getFullYear().toString().slice(-2);
  const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
  const random = faker.number.int({ min: 1000, max: 9999 });
  return `PRO-${year}${month}-${random}`;
}

function generarFolioFruta(): string {
  const fecha = new Date();
  const year = fecha.getFullYear().toString().slice(-2);
  const random = faker.number.int({ min: 100, max: 999 });
  return `FRU-${year}-${random}`;
}

function generarLote(): string {
  const fecha = new Date();
  const year = fecha.getFullYear().toString().slice(-2);
  const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
  const random = faker.number.int({ min: 10, max: 99 });
  return `LOTE-${year}${month}${random}`;
}

function fechaReciente(days: number = 30): Date {
  return faker.date.recent({ days });
}

function horaAleatoriaEnFecha(fecha: Date, horasMin: number = 0, horasMax: number = 8): Date {
  const nuevaFecha = new Date(fecha);
  nuevaFecha.setHours(nuevaFecha.getHours() + faker.number.int({ min: horasMin, max: horasMax }));
  nuevaFecha.setMinutes(faker.number.int({ min: 0, max: 59 }));
  return nuevaFecha;
}

async function limpiarBaseDatos() {
  console.log('🧹 Limpiando base de datos...');
  
  // Eliminar en orden inverso por las dependencias
  await prisma.rEVISION_DOCUMENTACION.deleteMany();
  await prisma.rEVISION_TRANSPORTE.deleteMany();
  await prisma.rEGISTRO_SALIDA_TRANSPORTE.deleteMany();
  await prisma.rEGISTRO_REFRIGERACION_PASTEURIZACION.deleteMany();
  await prisma.rEGISTRO_EXTRACTORES_FINISHER.deleteMany();
  await prisma.rEGISTRO_VERIFICACION_DETERGENTE.deleteMany();
  await prisma.rEGISTRO_MERMA.deleteMany();
  await prisma.rEGISTRO_DESCARGA_FRUTA.deleteMany();
  await prisma.dETALLES_REGISTRO_DESCARGA_FRUTA_PARA_PROCESO.deleteMany();
  await prisma.mUESTREOS.deleteMany();
  await prisma.rEGISTRO_PROCESO.deleteMany();
  await prisma.pROVEEDORES.deleteMany();
  
  console.log('✅ Base de datos limpia');
}

async function crearProveedores(cantidad: number = 5) {
  console.log('👥 Creando proveedores...');
  
  const proveedores = [];
  
  for (let i = 0; i < cantidad; i++) {
    const proveedor = await prisma.pROVEEDORES.create({
      data: {
        nombre: faker.person.fullName(),
        empresa: faker.helpers.arrayElement(PROVEEDORES_NOMBRES),
        direccion: faker.location.streetAddress(),
        estado: faker.location.state(),
        codigoPostal: faker.location.zipCode(),
        pais: 'México',
        telefono: faker.phone.number(),
        email: faker.internet.email(),
      },
    });
    proveedores.push(proveedor);
  }
  
  console.log(`✅ ${cantidad} proveedores creados`);
  return proveedores;
}

async function crearMuestreos(cantidad: number = 10, proveedores: any[]) {
  console.log('🔬 Creando muestreos...');
  
  const muestreos = [];
  
  for (let i = 0; i < cantidad; i++) {
    const proveedorAleatorio = faker.helpers.arrayElement(proveedores);
    
    const muestreo = await prisma.mUESTREOS.create({
      data: {
        fecha: fechaReciente(60),
        proveedor_id: proveedorAleatorio.id,
        huertero: faker.person.fullName(),
        lote: generarLote(),
        ciudad: faker.location.city(),
        estado: faker.location.state(),
        ton_aprox: faker.number.float({ min: 5, max: 50, fractionDigits: 2 }),
        bta: faker.number.float({ min: 8, max: 12, fractionDigits: 2 }),
        acidez: faker.number.float({ min: 0.5, max: 2.0, fractionDigits: 2 }),
        rto: faker.number.float({ min: 40, max: 60, fractionDigits: 2 }),
        rendimiento: faker.number.float({ min: 45, max: 55, fractionDigits: 2 }),
        sabor: faker.helpers.arrayElement(['Dulce', 'Ácido', 'Equilibrado', 'Muy Dulce']),
        color: faker.helpers.arrayElement(['Naranja Intenso', 'Naranja Claro', 'Amarillo', 'Verde']),
        aceite: faker.number.float({ min: 0.1, max: 1.5, fractionDigits: 2 }),
        observaciones: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.3 }),
        analizo: faker.person.fullName(),
      },
    });
    muestreos.push(muestreo);
  }
  
  console.log(`✅ ${cantidad} muestreos creados`);
  return muestreos;
}

async function crearProcesosCompletos(cantidad: number = 15, proveedores: any[], muestreos: any[]) {
  console.log('🏭 Creando procesos completos...');
  
  for (let i = 0; i < cantidad; i++) {
    const tipoProceso = faker.helpers.arrayElement([TipoProceso.Convencional, TipoProceso.Organico]);
    const variedad = faker.helpers.arrayElement(VARIEDADES);
    const destino = faker.helpers.arrayElement(DESTINOS);
    const idProceso = generarIdProceso();
    const folioFruta = generarFolioFruta();
    const fechaProceso = fechaReciente(45);
    const status = faker.helpers.arrayElement([
      Status_Proceso.En_Proceso,
      Status_Proceso.Completado,
      Status_Proceso.Pendiente,
    ]);

    console.log(`  📦 Creando proceso ${i + 1}/${cantidad}: ${idProceso}`);

    // 1. Crear el proceso principal
    const proceso = await prisma.rEGISTRO_PROCESO.create({
      data: {
        id_proceso: idProceso,
        fecha: fechaProceso,
        tipo_proceso: tipoProceso,
        variedad,
        destino,
        lote_asignado: generarLote(),
        status,
      },
    });

    // 2. Crear detalles de descarga de fruta (con muestreo opcional)
    const muestreoAleatorio = faker.helpers.maybe(
      () => faker.helpers.arrayElement(muestreos), 
      { probability: 0.7 }
    );
    
    const detalles = await prisma.dETALLES_REGISTRO_DESCARGA_FRUTA_PARA_PROCESO.create({
      data: {
        bins: faker.number.int({ min: 50, max: 200 }),
        jaula: faker.helpers.arrayElement(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']),
        estado: faker.location.state(),
        municipio: faker.location.city(),
        huerta: `Huerta ${faker.company.name()}`,
        observaciones: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.3 }),
        muestra_id: muestreoAleatorio?.id,
      },
    });

    // 3. Crear registro de descarga de fruta
    const inicioDescarga = horaAleatoriaEnFecha(fechaProceso, 6, 8);
    const finDescarga = horaAleatoriaEnFecha(inicioDescarga, 2, 6);
    const cantidadProgramada = faker.number.float({ min: 10, max: 40, fractionDigits: 2 });
    const cantidadReal = faker.number.float({ 
      min: cantidadProgramada * 0.95, 
      max: cantidadProgramada * 1.05, 
      fractionDigits: 2 
    });

    const proveedorAleatorio = faker.helpers.arrayElement(proveedores);

    await prisma.rEGISTRO_DESCARGA_FRUTA.create({
      data: {
        id_proceso: idProceso,
        folio_fruta: folioFruta,
        fecha: fechaProceso,
        placas_transporte: faker.vehicle.vrm(),
        variedad,
        destino,
        tipo_proceso: tipoProceso,
        inicio_descarga: inicioDescarga,
        fin_descarga: finDescarga,
        cant_progra_desca: cantidadProgramada,
        cant_real_desca: cantidadReal,
        num_orden: faker.number.int({ min: 1, max: 100 }),
        observaciones: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.2 }),
        proveedor_id: proveedorAleatorio.id,
        detalles_id: detalles.id,
      },
    });

    // 4. Crear registros de merma (1-3 por proceso)
    const numMermas = faker.number.int({ min: 1, max: 3 });
    for (let j = 0; j < numMermas; j++) {
      const pesoBruto = faker.number.float({ min: 1000, max: 5000, fractionDigits: 2 });
      const pesoTara = faker.number.float({ min: 100, max: 500, fractionDigits: 2 });
      const pesoNeto = pesoBruto - pesoTara;

      await prisma.rEGISTRO_MERMA.create({
        data: {
          id_proceso: idProceso,
          fecha: fechaProceso,
          tipo_proceso: tipoProceso,
          variedad,
          num_orden: faker.number.int({ min: 1, max: 100 }),
          area: faker.helpers.arrayElement(['Selección', 'Lavado', 'Clasificación']),
          hora_pesado: horaAleatoriaEnFecha(fechaProceso, 8, 14),
          fin_descarga: finDescarga,
          cant_progra_desca: cantidadProgramada,
          peso_bruto: pesoBruto,
          peso_tara: pesoTara,
          peso_neto: pesoNeto,
          observaciones: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.3 }),
          turno: faker.helpers.arrayElement([1, 2, 3]),
        },
      });
    }

    // 5. Crear registro de verificación de detergente
    await prisma.rEGISTRO_VERIFICACION_DETERGENTE.create({
      data: {
        id_proceso: idProceso,
        folio_fruta: folioFruta,
        fecha: fechaProceso,
        tipo_proceso: tipoProceso,
        hora: horaAleatoriaEnFecha(fechaProceso, 8, 10),
        cant_agua: faker.number.float({ min: 500, max: 2000, fractionDigits: 2 }),
        producto: faker.helpers.arrayElement(PRODUCTOS_DETERGENTE),
        cantidad: faker.number.float({ min: 5, max: 50, fractionDigits: 2 }),
        concentracion: faker.number.float({ min: 0.5, max: 5.0, fractionDigits: 2 }),
        resp_dilucion: faker.person.fullName(),
        num_orden: faker.number.int({ min: 1, max: 100 }),
      },
    });

    // 6. Crear registros de extractores y finisher (2-4 por proceso)
    const numExtractores = faker.number.int({ min: 2, max: 4 });
    for (let j = 0; j < numExtractores; j++) {
      await prisma.rEGISTRO_EXTRACTORES_FINISHER.create({
        data: {
          id_proceso: idProceso,
          folio_fruta: folioFruta,
          fecha: fechaProceso,
          producto: destino,
          tipo_proceso: tipoProceso,
          num_extractor: faker.number.int({ min: 1, max: 10 }),
          modelo: faker.number.int({ min: 2018, max: 2024 }),
          medida_extractor: faker.number.float({ min: 50, max: 100, fractionDigits: 1 }),
          hora: horaAleatoriaEnFecha(fechaProceso, 10, 14),
          cap_ext: faker.number.int({ min: 1000, max: 5000 }),
          presion: faker.number.float({ min: 80, max: 120, fractionDigits: 1 }),
          ajuste_micro: faker.helpers.arrayElement(['Fino', 'Medio', 'Grueso']),
          valor_extraccion: `${faker.number.int({ min: 40, max: 60 })}%`,
          observaciones: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.2 }),
          hora_finisher_primario: horaAleatoriaEnFecha(fechaProceso, 14, 16),
          psi_finisher_primario: `${faker.number.int({ min: 30, max: 60 })} PSI`,
        },
      });
    }

    // 7. Crear registros de refrigeración y pasteurización (1-2 por proceso)
    const numRefrigeracion = faker.number.int({ min: 1, max: 2 });
    for (let j = 0; j < numRefrigeracion; j++) {
      const inicioEnvio = horaAleatoriaEnFecha(fechaProceso, 14, 16);
      const finEnvio = horaAleatoriaEnFecha(inicioEnvio, 1, 3);

      await prisma.rEGISTRO_REFRIGERACION_PASTEURIZACION.create({
        data: {
          id_proceso: idProceso,
          folio_fruta: folioFruta,
          fecha: fechaProceso,
          producto: destino,
          tipo_proceso: tipoProceso,
          secuencia: j + 1,
          tpf: faker.number.int({ min: 100, max: 500 }),
          volumen: faker.number.int({ min: 1000, max: 10000 }),
          inicio_envio: inicioEnvio,
          fin_envio: finEnvio,
          tiempo_envio: finEnvio,
          temp_inicio: faker.number.float({ min: 20, max: 25, fractionDigits: 1 }),
          temp_medio: faker.number.float({ min: 10, max: 15, fractionDigits: 1 }),
          temp_fin: faker.number.float({ min: 2, max: 8, fractionDigits: 1 }),
          operador: faker.person.fullName(),
        },
      });
    }

    // 8. Crear registro de salida de transporte (solo para procesos completados)
    if (status === Status_Proceso.Completado) {
      const fechaEntrada = horaAleatoriaEnFecha(fechaProceso, 16, 18);
      const fechaSalida = horaAleatoriaEnFecha(fechaEntrada, 1, 2);

      const salidaTransporte = await prisma.rEGISTRO_SALIDA_TRANSPORTE.create({
        data: {
          id_proceso: idProceso,
          fecha_entrada: fechaEntrada,
          fecha_salida: fechaSalida,
          fecha_realizo: fechaProceso,
          num_placas_unidad: faker.vehicle.vrm(),
          num_placas_pipa: faker.vehicle.vrm(),
          linea_transporte: faker.helpers.arrayElement(LINEAS_TRANSPORTE),
          firma_chofer: faker.person.fullName(),
          nombre_chofer: faker.person.fullName(),
          nombre_realizo: faker.person.fullName(),
          firma_realizo: faker.person.fullName(),
        },
      });

      // 9. Crear revisión de documentación
      await prisma.rEVISION_DOCUMENTACION.create({
        data: {
          registro_salida_id: salidaTransporte.id,
          boleta_bascula: faker.helpers.arrayElement([RESPUESTA_FORMULARIOS.C, RESPUESTA_FORMULARIOS.NC]),
          manifiesto_carga: RESPUESTA_FORMULARIOS.C,
          certificado_analisis: RESPUESTA_FORMULARIOS.C,
          certificado_lavado: RESPUESTA_FORMULARIOS.C,
          certificado_inspeccion: faker.helpers.arrayElement([RESPUESTA_FORMULARIOS.C, RESPUESTA_FORMULARIOS.NC]),
          certificado_fumigacion: faker.helpers.arrayElement([RESPUESTA_FORMULARIOS.C, RESPUESTA_FORMULARIOS.NA]),
          certificado_ult_carga: RESPUESTA_FORMULARIOS.C,
          certificado_orden_carga: RESPUESTA_FORMULARIOS.C,
          carga_porte: RESPUESTA_FORMULARIOS.C,
        },
      });

      // 10. Crear revisión de transporte
      await prisma.rEVISION_TRANSPORTE.create({
        data: {
          registro_salida_id: salidaTransporte.id,
          corresponde_placas_num_unidad: RESPUESTA_FORMULARIOS.C,
          corresponde_placas_num_termo_pipa: RESPUESTA_FORMULARIOS.C,
          sin_perforaciones_caja_tanque: RESPUESTA_FORMULARIOS.C,
          condicion_paredes: RESPUESTA_FORMULARIOS.C,
          gatas_correas: RESPUESTA_FORMULARIOS.C,
          libre_insectos: RESPUESTA_FORMULARIOS.C,
          libre_olores: RESPUESTA_FORMULARIOS.C,
          libre_contaminacion: RESPUESTA_FORMULARIOS.C,
          condicion_piso: RESPUESTA_FORMULARIOS.C,
          residuos_carga_ant: faker.helpers.arrayElement([RESPUESTA_FORMULARIOS.C, RESPUESTA_FORMULARIOS.NC]),
          fuga: faker.helpers.arrayElement([RESPUESTA_FORMULARIOS.C, RESPUESTA_FORMULARIOS.NC]),
          sellos_escotilla_val_puerta: RESPUESTA_FORMULARIOS.C,
          difusor_termo: RESPUESTA_FORMULARIOS.C,
          temp_int_termo: RESPUESTA_FORMULARIOS.C,
        },
      });
    }

    console.log(`  ✅ Proceso ${idProceso} creado completamente`);
  }

  console.log(`✅ ${cantidad} procesos completos creados`);
}

async function main() {
  console.log('🌱 Iniciando seed de base de datos...\n');

  try {
    // Limpiar base de datos
    await limpiarBaseDatos();
    
    // Crear datos base
    const proveedores = await crearProveedores(5);
    const muestreos = await crearMuestreos(10, proveedores);
    
    // Crear procesos completos con todas sus relaciones
    await crearProcesosCompletos(15, proveedores, muestreos);

    console.log('\n✅ Seed completado exitosamente!');
    console.log('\n📊 Resumen:');
    console.log(`   - Proveedores: ${await prisma.pROVEEDORES.count()}`);
    console.log(`   - Muestreos: ${await prisma.mUESTREOS.count()}`);
    console.log(`   - Procesos: ${await prisma.rEGISTRO_PROCESO.count()}`);
    console.log(`   - Descargas: ${await prisma.rEGISTRO_DESCARGA_FRUTA.count()}`);
    console.log(`   - Mermas: ${await prisma.rEGISTRO_MERMA.count()}`);
    console.log(`   - Verificaciones detergente: ${await prisma.rEGISTRO_VERIFICACION_DETERGENTE.count()}`);
    console.log(`   - Extractores: ${await prisma.rEGISTRO_EXTRACTORES_FINISHER.count()}`);
    console.log(`   - Refrigeraciones: ${await prisma.rEGISTRO_REFRIGERACION_PASTEURIZACION.count()}`);
    console.log(`   - Salidas transporte: ${await prisma.rEGISTRO_SALIDA_TRANSPORTE.count()}`);
  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });