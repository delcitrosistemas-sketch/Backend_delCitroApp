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

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsuariosModule,
    EmpleadosModule,
    DocumentosCalidadModule,
    RegEntraFrutaModule,
    MuestreosModule,
    ProveedoresModule,
  ],
  exports: [
    UsuariosModule,
    EmpleadosModule,
    DocumentosCalidadModule,
    RegEntraFrutaModule,
    MuestreosModule,
    ProveedoresModule,
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
