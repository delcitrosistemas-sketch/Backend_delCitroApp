import { Module } from '@nestjs/common';
import { RegEntraFrutaController } from './reg_entra_fruta.controller';
import { RegEntraFrutaService } from './reg_entra_fruta.service';
import { FoliosService } from '../../../shared/folios/folios.service';

@Module({
  controllers: [RegEntraFrutaController],
  providers: [RegEntraFrutaService, FoliosService],
})
export class RegEntraFrutaModule {}
