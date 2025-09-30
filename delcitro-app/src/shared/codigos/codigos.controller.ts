import { Controller, Get, Query } from '@nestjs/common';
import { Public } from 'src/common/decorators';
import { CodigosService } from './codigos.service';

@Controller('formato/codigos')
export class CodigosController {
  constructor(private codigoService: CodigosService) {}

  @Public()
  @Get('/proceso')
  async generarFolioProceso(@Query('codigoProducto') codigoProducto: string) {
    try {
      const codigo = await this.codigoService.generarCodigoProceso(codigoProducto);

      return {
        success: true,
        codigo,
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
