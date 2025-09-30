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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { DocumentosCalidadService } from './documentos-calidad.service';
import { extname } from 'path';
import { Public } from 'src/common/decorators';

@Controller('doc-sgc')
export class DocumentosCalidadController {
  constructor(private readonly service: DocumentosCalidadService) {}

  @Public()
  @Post('/upload')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/docs',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
    }),
  }))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { titulo: string; descripcion?: string; tipo: string; usuario_id?: number },
  ) {
    return this.service.create({
      titulo: body.titulo,
      descripcion: body.descripcion,
      tipo: body.tipo,
      archivo: file.originalname,
      nombre: file.originalname,
      archivoUrl: `/uploads/docs/${file.filename}`,
      extension: extname(file.originalname).replace('.', ''),
      ...(body.usuario_id && {
        usuario: { connect: { id: Number(body.usuario_id) } },
      }),
    });
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
