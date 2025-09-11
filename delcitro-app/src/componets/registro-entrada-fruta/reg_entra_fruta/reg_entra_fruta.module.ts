import { Module } from '@nestjs/common';
import { RegEntraFrutaController } from './reg_entra_fruta.controller';
import { RegEntraFrutaService } from './reg_entra_fruta.service';

@Module({
  controllers: [RegEntraFrutaController],
  providers: [RegEntraFrutaService],
})
export class RegEntraFrutaModule {}
