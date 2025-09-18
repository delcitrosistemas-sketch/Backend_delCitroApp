import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Delete,
  UploadedFile,
  UseInterceptors,
  ParseIntPipe,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UsuariosService } from './usuarios.service';
import { GetCurrentUserId } from 'src/common/decorators';
import { Prisma } from '@prisma/client';
import { Public } from '../../common/decorators/public.decorator';

@Controller('usuarios')
export class UsuariosController {
  constructor(private userService: UsuariosService) {}

  @Public()
  @Post('/crear-usuario')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() data: Prisma.USUARIOSCreateInput) {
    return this.userService.create(data);
  }

  @Public()
  @Get('/get-all')
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: Prisma.USUARIOSUpdateInput) {
    return this.userService.update(id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }

  @Post('/perfil')
  @HttpCode(HttpStatus.OK)
  async infoUser(@GetCurrentUserId() userId: number) {
    console.log('Entrando info usuario con ID:', userId);
    return this.userService.infoUserProfileById(userId);
  }

  @Post('/avatar')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads/avatars',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @GetCurrentUserId() userId: number,
  ) {
    if (!file) {
      return { message: 'No se subió ninguna imagen' };
    }

    await this.userService.updateAvatar(userId, file.filename);
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001';

    return {
      message: 'Avatar actualizado correctamente',
      avatarUrl: `${backendUrl}/uploads/avatars/${file.filename}`,
    };
  }
}
