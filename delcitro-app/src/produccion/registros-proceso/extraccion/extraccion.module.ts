import { Module } from '@nestjs/common';
import { ExtraccionService } from './extraccion.service';
import { ExtraccionController } from './extraccion.controller';

@Module({
  providers: [ExtraccionService],
  controllers: [ExtraccionController],
})
export class ExtraccionModule {}
