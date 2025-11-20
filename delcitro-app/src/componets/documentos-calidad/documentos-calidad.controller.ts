import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentosCalidadService } from './documentos-calidad.service';
import { Public } from '../../common/decorators';
import { CloudinaryService } from '../../cloudinary/cloudinary.service';
import * as multer from 'multer';

@Controller('doc-sgc')
export class DocumentosCalidadController {
  constructor(
    private readonly service: DocumentosCalidadService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { storage: multer.memoryStorage() }))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const result = await this.cloudinaryService.uploadDocument(file);
    return {
      message: 'Subida completada',
      url: result.secure_url,
      public_id: result.public_id,
    };
  }

  @Public()
  @Get('/find-All')
  async findAll() {
    return this.service.findAll();
  }

  @Public()
  @Get('/find/:id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Public()
  @Put('/update/:id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    return this.service.update(id, data);
  }

  @Delete('/delete/:id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  @Public()
  @Get('/getAll-categories')
  async findAllCategories() {
    return this.service.findAllCategories();
  }

  @Public()
  @Get('/getAll-categories/count')
  async findAllCategoriesCount() {
    return this.service.findAllCategoriesCount();
  }
}
