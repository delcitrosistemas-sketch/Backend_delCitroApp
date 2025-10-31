import { Controller, Get, Query } from '@nestjs/common';
import { BoletasService } from './boletas.service';
import { Public } from '../../common/decorators';

@Controller('/formato/boletas')
export class BoletasController {
  constructor(private boletaService: BoletasService) {}

  @Public()
  @Get('/registro-entrada-fruta')
  async generarLoteProductoTerminado(@Query('tipo') tipo: string) {
    try {
      const lote = await this.boletaService.generarBoletaRecepcionFruta(tipo as any);
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
