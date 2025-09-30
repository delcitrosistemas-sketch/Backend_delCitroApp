import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';
import { ProveedoresService } from './proveedores.service';

@Controller('proveedores')
export class ProveedoresController {
  constructor(private proveedoresService: ProveedoresService) {}

  @Public()
  @Get('/getAllNames')
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return this.proveedoresService.findAllNames();
  }
}
