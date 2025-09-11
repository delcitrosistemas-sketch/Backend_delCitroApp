import { Module } from '@nestjs/common';
import { MuestreosController } from './muestreos.controller';
import { MuestreosService } from './muestreos.service';

@Module({
  controllers: [MuestreosController],
  providers: [MuestreosService]
})
export class MuestreosModule {}
