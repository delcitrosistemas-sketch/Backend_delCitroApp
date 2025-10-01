import { Module } from '@nestjs/common';
import { HomogenizacionService } from './homogenizacion.service';
import { HomogenizacionController } from './homogenizacion.controller';

@Module({
  controllers: [HomogenizacionController],
  providers: [HomogenizacionService],
})
export class HomogenizacionModule {}
