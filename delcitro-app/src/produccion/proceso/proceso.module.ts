import { Module } from '@nestjs/common';
import { ProcesoController } from './proceso.controller';
import { ProcesoService } from './proceso.service';

// Modules
import { CargaProductoTerminadoModule } from '../registros-proceso/carga-producto-terminado/carga-producto-terminado.module';
import { DescargaModule } from '../registros-proceso/descarga-fruta/descarga.module';
import { ExtraccionModule } from '../registros-proceso/extraccion/extraccion.module';
import { HomogenizacionModule } from '../registros-proceso/homogenizacion/homogenizacion.module';
import { RefrigeracionModule } from '../registros-proceso/refrigeracion/refrigeracion.module';
import { SeleccionModule } from '../registros-proceso/seleccion/seleccion.module';
import { PrismaProcesoModule } from 'src/prisma/proceso/prisma.proceso.module';
import { LavadoModule } from '../registros-proceso/lavado/lavado.module';

// Controllers
import { SeleccionController } from '../registros-proceso/seleccion/seleccion.controller';
import { DescargaController } from '../registros-proceso/descarga-fruta/descarga.controller';
import { ExtraccionController } from '../registros-proceso/extraccion/extraccion.controller';
import { HomogenizacionController } from '../registros-proceso/homogenizacion/homogenizacion.controller';
import { RefrigeracionController } from '../registros-proceso/refrigeracion/refrigeracion.controller';
import { CargaProductoTerminadoController } from '../registros-proceso/carga-producto-terminado/carga-producto-terminado.controller';
import { LavadoController } from '../registros-proceso/lavado/lavado.controller';

// Services
import { FoliosService } from 'src/shared/folios/folios.service';
import { DescargaService } from '../registros-proceso/descarga-fruta/descarga.service';
import { SeleccionService } from '../registros-proceso/seleccion/seleccion.service';
import { ExtraccionService } from '../registros-proceso/extraccion/extraccion.service';
import { RefrigeracionService } from '../registros-proceso/refrigeracion/refrigeracion.service';
import { HomogenizacionService } from '../registros-proceso/homogenizacion/homogenizacion.service';
import { CargaProductoTerminadoService } from '../registros-proceso/carga-producto-terminado/carga-producto-terminado.service';
import { LavadoService } from '../registros-proceso/lavado/lavado.service';

@Module({
  controllers: [
    ProcesoController,
    SeleccionController,
    DescargaController,
    ExtraccionController,
    HomogenizacionController,
    RefrigeracionController,
    CargaProductoTerminadoController,
    LavadoController,
  ],
  providers: [
    ProcesoService,
    FoliosService,
    DescargaService,
    SeleccionService,
    ExtraccionService,
    RefrigeracionService,
    HomogenizacionService,
    CargaProductoTerminadoService,
    LavadoService,
  ],
  imports: [
    PrismaProcesoModule,
    CargaProductoTerminadoModule,
    DescargaModule,
    ExtraccionModule,
    HomogenizacionModule,
    RefrigeracionModule,
    SeleccionModule,
    LavadoModule,
  ],
  exports: [
    ProcesoService,
    CargaProductoTerminadoModule,
    DescargaModule,
    ExtraccionModule,
    HomogenizacionModule,
    RefrigeracionModule,
    SeleccionModule,
    LavadoModule,
  ],
})
export class ProcesoModule {}
