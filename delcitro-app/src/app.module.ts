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

@Module({
  imports: [PrismaModule, AuthModule, UsuariosModule, EmpleadosModule, DocumentosCalidadModule],
  exports: [UsuariosModule, EmpleadosModule, DocumentosCalidadModule],
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
