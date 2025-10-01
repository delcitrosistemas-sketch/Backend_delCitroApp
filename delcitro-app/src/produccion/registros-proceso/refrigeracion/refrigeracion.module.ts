import { Module } from '@nestjs/common';
import { RefrigeracionService } from './refrigeracion.service';
import { RefrigeracionController } from './refrigeracion.controller';

@Module({
  providers: [RefrigeracionService],
  controllers: [RefrigeracionController],
})
export class RefrigeracionModule {}
