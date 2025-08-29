import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Public } from 'src/common/decorators';
import { FindUserDto } from '../models/Usuario.model';


import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UsuariosService } from './usuarios.service';
import { GetCurrentUserId } from 'src/common/decorators';

@Controller('usuarios')
export class UsuariosController {
  constructor(private userService: UsuariosService) {}

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
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
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
