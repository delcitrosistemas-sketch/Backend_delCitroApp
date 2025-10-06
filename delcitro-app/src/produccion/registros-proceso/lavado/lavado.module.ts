import { Module } from '@nestjs/common';
import { LavadoController } from './lavado.controller';
import { LavadoService } from './lavado.service';

@Module({
  controllers: [LavadoController],
  providers: [LavadoService],
})
export class LavadoModule {}
