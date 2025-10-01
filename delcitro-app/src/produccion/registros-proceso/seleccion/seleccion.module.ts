import { Module } from '@nestjs/common';
import { SeleccionService } from './seleccion.service';
import { SeleccionController } from './seleccion.controller';

@Module({
  providers: [SeleccionService],
  controllers: [SeleccionController],
})
export class SeleccionModule {}
