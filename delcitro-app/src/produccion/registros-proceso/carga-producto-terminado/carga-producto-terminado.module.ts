import { Module } from '@nestjs/common';
import { CargaProductoTerminadoController } from './carga-producto-terminado.controller';
import { CargaProductoTerminadoService } from './carga-producto-terminado.service';

@Module({
  controllers: [CargaProductoTerminadoController],
  providers: [CargaProductoTerminadoService],
})
export class CargaProductoTerminadoModule {}
