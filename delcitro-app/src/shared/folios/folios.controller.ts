import { Controller, Get, Query } from '@nestjs/common';
import { FoliosService } from './folios.service';
import { Public } from 'src/common/decorators';

@Controller('formato/folios')
export class FoliosController {
  constructor(private folioService: FoliosService) {}

  @Public()
  @Get('/recepcion-fruta')
  async generarFolioRecepcionFruta(
    @Query('fruta') fruta: 'Naranja' | 'Toronja' | 'Limon' | 'Mandarina',
    @Query('organico') organico?: string,
  ) {
    try {
      const isOrganico = organico === 'true';
      const folio = await this.folioService.generarFolioRecepcionFruta(fruta, isOrganico);

      return {
        success: true,
        folio,
        detalles: {
          fruta,
          organico: isOrganico,
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
  @Get('/fruta-proceso')
  async generarFolioProceso() {
    try {
      const folio = await this.folioService.generarCodigoProceso();

      return {
        success: true,
        folio,
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
  @Get('producto-terminado')
  async generarFolioAutomatico(
    @Query('codigoProducto') codigoProducto: string,
    @Query('temporada') temporada: string,
    @Query('org') org?: boolean,
  ) {
    try {
      return {
        folio: await this.folioService.generarFolioProductoTerminado(
          codigoProducto,
          temporada,
          org,
        ),
        fechaGeneracion: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}
