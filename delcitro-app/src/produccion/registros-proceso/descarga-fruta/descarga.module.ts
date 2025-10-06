import { Module } from '@nestjs/common';
import { DescargaController } from './descarga.controller';
import { DescargaService } from './descarga.service';

@Module({
  controllers: [DescargaController],
  providers: [DescargaService],
})
export class DescargaModule {}
