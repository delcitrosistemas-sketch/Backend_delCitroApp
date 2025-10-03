import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './common/guards';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './componets/usuarios/usuarios.module';
import { EmpleadosModule } from './componets/empleados/empleados.module';
import { DocumentosCalidadModule } from './componets/documentos-calidad/documentos-calidad.module';
import { RegEntraFrutaModule } from './componets/registro-entrada-fruta/reg_entra_fruta/reg_entra_fruta.module';
import { MuestreosModule } from './componets/muestreos/muestreos.module';
import { ProveedoresModule } from './componets/proveedores/proveedores.module';
import { FoliosModule } from './shared/folios/folios.module';
import { CodigosModule } from './shared/codigos/codigos.module';
import { LotesModule } from './shared/lotes/lotes.module';
import { BoletasModule } from './shared/boletas/boletas.module';
import { PrismaProcesoModule } from './prisma/proceso/prisma.proceso.module';
import { ProcesoModule } from './produccion/proceso/proceso.module';

@Module({
  imports: [
    PrismaModule,
    PrismaProcesoModule,
    AuthModule,
    UsuariosModule,
    EmpleadosModule,
    DocumentosCalidadModule,
    RegEntraFrutaModule,
    MuestreosModule,
    ProveedoresModule,
    FoliosModule,
    CodigosModule,
    LotesModule,
    BoletasModule,
    ProcesoModule,
  ],
  exports: [
    UsuariosModule,
    EmpleadosModule,
    DocumentosCalidadModule,
    RegEntraFrutaModule,
    MuestreosModule,
    ProveedoresModule,
    FoliosModule,
    CodigosModule,
    LotesModule,
    PrismaModule,
    PrismaProcesoModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
})
export class AppModule {}
