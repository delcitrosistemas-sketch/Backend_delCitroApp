import { Module } from '@nestjs/common';
import { DocumentosCalidadController } from './documentos-calidad.controller';
import { DocumentosCalidadService } from './documentos-calidad.service';
import { CloudinaryModule } from '../../cloudinary/cloudinary.module';

@Module({
  imports: [CloudinaryModule],
  controllers: [DocumentosCalidadController],
  providers: [DocumentosCalidadService],
})
export class DocumentosCalidadModule {}
