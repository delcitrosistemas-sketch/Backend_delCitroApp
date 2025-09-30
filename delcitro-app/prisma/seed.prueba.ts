import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de módulos por área...');

  // 1. Primero verificamos que las áreas existan
  const areas = await prisma.aREAS.findMany();
  console.log(`📊 Áreas encontradas: ${areas.length}`);

  if (areas.length === 0) {
    console.log('❌ No hay áreas existentes. Primero debes poblar la tabla AREAS.');
    return;
  }

  // 2. Definimos los módulos por tipo de área

  const modulosPorArea = [
    // ÁREAS DE PROCESO
    /*
    {
      areaCodigo: 'produccion',
      modulos: [
        { nombre: 'Dashboard Proceso', codigo: 'dashboard-proceso', url: '/proceso/dashboard', icono: 'LayoutDashboard', orden: 1 },
        { nombre: 'Control de Producción', codigo: 'control-produccion', url: '/proceso/produccion', icono: 'Factory', orden: 2 },
        { nombre: 'Parámetros de Calidad', codigo: 'parametros-calidad', url: '/proceso/parametros', icono: 'Gauge', orden: 3 },
        { nombre: 'Reportes de Turno', codigo: 'reportes-turno', url: '/proceso/reportes', icono: 'ClipboardList', orden: 4 },
      ]
    },
    */
    // DESCARGA
    {
      areaCodigo: 'DESCARGA',
      modulos: [
        { nombre: 'Registro de Entrada', codigo: 'registro-entrada', url: '/descarga/entrada', icono: 'Truck', orden: 1 },
        { nombre: 'Control de Calidad', codigo: 'control-calidad', url: '/descarga/calidad', icono: 'CheckCircle', orden: 2 },
        { nombre: 'Bitácora de Descarga', codigo: 'bitacora-descarga', url: '/descarga/bitacora', icono: 'FileText', orden: 3 },
      ]
    },

    // CALIDAD - LABORATORIO
    {
      areaCodigo: 'Laboratorio',
      modulos: [
        { nombre: 'Análisis de Muestras', codigo: 'analisis-muestras', url: '/calidad/muestras', icono: 'FlaskConical', orden: 1 },
        { nombre: 'Especificaciones', codigo: 'especificaciones', url: '/calidad/especificaciones', icono: 'FileCheck', orden: 2 },
        { nombre: 'No Conformidades', codigo: 'no-conformidades', url: '/calidad/noconformidades', icono: 'AlertTriangle', orden: 3 },
        { nombre: 'Certificados', codigo: 'certificados', url: '/calidad/certificados', icono: 'Award', orden: 4 },
      ]
    },

    // ADMINISTRATIVO - FINANZAS
    {
      areaCodigo: 'administracion',
      modulos: [
        { nombre: 'Dashboard Financiero', codigo: 'dashboard-finanzas', url: '/finanzas/dashboard', icono: 'PieChart', orden: 1 },
        { nombre: 'Facturación', codigo: 'facturacion', url: '/finanzas/facturacion', icono: 'Receipt', orden: 2 },
        { nombre: 'Reportes Contables', codigo: 'reportes-contables', url: '/finanzas/contabilidad', icono: 'BarChart', orden: 3 },
        { nombre: 'Presupuestos', codigo: 'presupuestos', url: '/finanzas/presupuestos', icono: 'Wallet', orden: 4 },
      ]
    },

    // RECURSOS HUMANOS
    {
      areaCodigo: 'RECURSOS_HUMANOS',
      modulos: [
        { nombre: 'Gestión de Empleados', codigo: 'gestion-empleados', url: '/rrhh/empleados', icono: 'Users', orden: 1 },
        { nombre: 'Nómina', codigo: 'nomina', url: '/rrhh/nomina', icono: 'DollarSign', orden: 2 },
        { nombre: 'Asistencias', codigo: 'asistencias', url: '/rrhh/asistencias', icono: 'Clock', orden: 3 },
        { nombre: 'Capacitaciones', codigo: 'capacitaciones', url: '/rrhh/capacitaciones', icono: 'GraduationCap', orden: 4 },
      ]
    },

    // ALMACEN
    {
      areaCodigo: 'almacen',
      modulos: [
        { nombre: 'Inventario', codigo: 'inventario', url: '/almacen/inventario', icono: 'Package', orden: 1 },
        { nombre: 'Entradas/Salidas', codigo: 'movimientos', url: '/almacen/movimientos', icono: 'ArrowLeftRight', orden: 2 },
        { nombre: 'Solicitudes', codigo: 'solicitudes', url: '/almacen/solicitudes', icono: 'ClipboardCheck', orden: 3 },
        { nombre: 'Reportes Stock', codigo: 'reportes-stock', url: '/almacen/reportes', icono: 'TrendingUp', orden: 4 },
      ]
    },

    // SISTEMAS DE CALIDAD
    {
      areaCodigo: 'SISTEMAS_CALIDAD',
      modulos: [
        { nombre: 'Documentación SGC', codigo: 'documentacion-sgc', url: '/calidad/documentos', icono: 'FolderOpen', orden: 1 },
        { nombre: 'Auditorías', codigo: 'auditorias', url: '/calidad/auditorias', icono: 'SearchCheck', orden: 2 },
        { nombre: 'Indicadores', codigo: 'indicadores', url: '/calidad/indicadores', icono: 'Target', orden: 3 },
        { nombre: 'Mejora Continua', codigo: 'mejora-continua', url: '/calidad/mejora', icono: 'TrendingUp', orden: 4 },
      ]
    },

    // MANTENIMIENTO
    {
      areaCodigo: 'MANTENIMIENTO',
      modulos: [
        { nombre: 'Órdenes de Trabajo', codigo: 'ordenes-trabajo', url: '/mantenimiento/ordenes', icono: 'Wrench', orden: 1 },
        { nombre: 'Preventivo', codigo: 'mantenimiento-preventivo', url: '/mantenimiento/preventivo', icono: 'Calendar', orden: 2 },
        { nombre: 'Correctivo', codigo: 'mantenimiento-correctivo', url: '/mantenimiento/correctivo', icono: 'AlertCircle', orden: 3 },
        { nombre: 'Inventario Refacciones', codigo: 'refacciones', url: '/mantenimiento/refacciones', icono: 'Settings', orden: 4 },
      ]
    },

    // VENTAS
    {
      areaCodigo: 'ventas',
      modulos: [
        { nombre: 'Clientes', codigo: 'clientes', url: '/ventas/clientes', icono: 'UserCheck', orden: 1 },
        { nombre: 'Pedidos', codigo: 'pedidos', url: '/ventas/pedidos', icono: 'ShoppingCart', orden: 2 },
        { nombre: 'Cotizaciones', codigo: 'cotizaciones', url: '/ventas/cotizaciones', icono: 'FileText', orden: 3 },
        { nombre: 'Reportes Ventas', codigo: 'reportes-ventas', url: '/ventas/reportes', icono: 'LineChart', orden: 4 },
      ]
    },

    // COMPRAS
    {
      areaCodigo: 'COMPRAS',
      modulos: [
        { nombre: 'Proveedores', codigo: 'proveedores', url: '/compras/proveedores', icono: 'Truck', orden: 1 },
        { nombre: 'Órdenes Compra', codigo: 'ordenes-compra', url: '/compras/ordenes', icono: 'ShoppingBag', orden: 2 },
        { nombre: 'Solicitudes', codigo: 'solicitudes-compras', url: '/compras/solicitudes', icono: 'ClipboardList', orden: 3 },
        { nombre: 'Inventario Proveedores', codigo: 'inventario-proveedores', url: '/compras/inventario', icono: 'Package', orden: 4 },
      ]
    }
  ];

  // 3. Insertar módulos para cada área
  let modulosCreados = 0;

  for (const grupo of modulosPorArea) {
    const area = await prisma.aREAS.findFirst({
      where: { codigo: grupo.areaCodigo }
    });

    if (!area) {
      console.log(`⚠️  Área ${grupo.areaCodigo} no encontrada, saltando...`);
      continue;
    }

    console.log(`📦 Creando módulos para área: ${area.nombre}`);

    for (const moduloData of grupo.modulos) {
      try {
        await prisma.mODULOS_AREA.upsert({
          where: {
            area_id_codigo: {
              area_id: area.id,
              codigo: moduloData.codigo
            }
          },
          update: {
            ...moduloData,
            activo: true,
            updatedAt: new Date()
          },
          create: {
            area_id: area.id,
            ...moduloData,
            activo: true
          }
        });
        modulosCreados++;
        console.log(`   ✅ ${moduloData.nombre}`);
      } catch (error) {
        console.log(`   ❌ Error creando módulo ${moduloData.nombre}:`, error);
      }
    }
  }

  console.log(`🎉 Seed completado. Módulos creados/actualizados: ${modulosCreados}`);

  // 4. Opcional: Crear permisos básicos para cada módulo
  await crearPermisosBasicos();
}

async function crearPermisosBasicos() {
  console.log('🔐 Creando permisos básicos para módulos...');

  const modulos = await prisma.mODULOS_AREA.findMany({
    where: { activo: true },
    include: { permisos: true }
  });

  let permisosCreados = 0;
  const rolesArea = ['ADMINISTRADOR_AREA', 'SUPERVISOR_AREA', 'OPERADOR', 'VISUALIZADOR'];

  for (const modulo of modulos) {
    for (const rol of rolesArea) {
      // Verificar si ya existe el permiso
      const permisoExistente = modulo.permisos.find(p => p.rol_area === rol);
      
      if (!permisoExistente) {
        try {
          await prisma.pERMISOS_MODULO.create({
            data: {
              modulo_id: modulo.id,
              rol_area: rol as any,
              puede_leer: true, // Todos pueden leer por defecto
              puede_crear: rol === 'ADMINISTRADOR_AREA' || rol === 'SUPERVISOR_AREA',
              puede_actualizar: rol === 'ADMINISTRADOR_AREA' || rol === 'SUPERVISOR_AREA',
              puede_eliminar: rol === 'ADMINISTRADOR_AREA'
            }
          });
          permisosCreados++;
        } catch (error) {
          console.log(`   ❌ Error creando permiso para ${modulo.nombre} - ${rol}`);
        }
      }
    }
  }

  console.log(`🔐 Permisos básicos creados: ${permisosCreados}`);
}

// Ejecutar el seed
main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });