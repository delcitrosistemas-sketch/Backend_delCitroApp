import { Module } from '@nestjs/common';
import { DocumentosCalidadController } from './documentos-calidad.controller';
import { DocumentosCalidadService } from './documentos-calidad.service';

@Module({
  controllers: [DocumentosCalidadController],
  providers: [DocumentosCalidadService],
})
export class DocumentosCalidadModule {}
