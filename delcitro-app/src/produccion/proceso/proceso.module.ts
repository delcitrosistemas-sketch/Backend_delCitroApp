import { Module } from '@nestjs/common';
import { ProcesoController } from './proceso.controller';
import { ProcesoService } from './proceso.service';
import { CargaProductoTerminadoModule } from '../registros-proceso/carga-producto-terminado/carga-producto-terminado.module';
import { DescargaModule } from '../registros-proceso/descarga/descarga.module';
import { ExtraccionModule } from '../registros-proceso/extraccion/extraccion.module';
import { HomogenizacionModule } from '../registros-proceso/homogenizacion/homogenizacion.module';
import { RefrigeracionModule } from '../registros-proceso/refrigeracion/refrigeracion.module';
import { SeleccionModule } from '../registros-proceso/seleccion/seleccion.module';
import { PrismaProcesoModule } from 'src/prisma/proceso/prisma.proceso.module';
import { FoliosService } from 'src/shared/folios/folios.service';

@Module({
  controllers: [ProcesoController],
  providers: [ProcesoService, FoliosService],
  imports: [
    PrismaProcesoModule,
    CargaProductoTerminadoModule,
    DescargaModule,
    ExtraccionModule,
    HomogenizacionModule,
    RefrigeracionModule,
    SeleccionModule,
  ],
  exports: [
    CargaProductoTerminadoModule,
    DescargaModule,
    ExtraccionModule,
    HomogenizacionModule,
    RefrigeracionModule,
    SeleccionModule,
  ],
})
export class ProcesoModule {}
