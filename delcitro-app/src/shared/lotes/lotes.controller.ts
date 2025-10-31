import { Controller, Get, Query } from '@nestjs/common';
import { LotesService } from './lotes.service';
import { Public } from '../../common/decorators';

@Controller('formato/lotes')
export class LotesController {
  constructor(private loteService: LotesService) {}

  @Public()
  @Get('/producto-terminado')
  async generarLoteProductoTerminado(
    @Query('codigoProducto') codigoProducto: string,
    @Query('esDelcitro') isLocal?: boolean,
  ) {
    try {
      const lote = await this.loteService.generarLoteProductoTerminado(codigoProducto, isLocal);

      return {
        success: true,
        lote,
        detalles: {
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @Public()
  @Get('/producto-organico')
  async generarLoteProductoOrganico(@Query('codigoProducto') codigoProducto: string) {
    try {
      const lote = await this.loteService.generarLoteProductoOrganico(codigoProducto);

      return {
        success: true,
        lote,
        detalles: {
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @Public()
  @Get('/prodalim-JCN')
  async generarLoteProductoJNCProdalim() {
    try {
      const lote = await this.loteService.generarLoteProdalimJugoNaranjaConcentrado();

      return {
        success: true,
        lote,
        detalles: {
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

    @Public()
  @Get('/prodalim-AEN')
  async generarLoteProductoAENProdalim() {
    try {
      const lote = await this.loteService.generarLoteProdalimAceiteEsencialNaranja();

      return {
        success: true,
        lote,
        detalles: {
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}
