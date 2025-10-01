import { Module } from '@nestjs/common';
import { BoletasController } from './boletas.controller';
import { BoletasService } from './boletas.service';

@Module({
  controllers: [BoletasController],
  providers: [BoletasService],
})
export class BoletasModule {}
