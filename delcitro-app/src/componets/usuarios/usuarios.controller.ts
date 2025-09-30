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
  ValidationPipe,
  UsePipes,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UsuariosService } from './usuarios.service';
import { GetCurrentUser, GetCurrentUserId } from 'src/common/decorators';
import { Prisma } from '@prisma/client';
import { AssignAreaDto } from 'src/auth/dto';
import { AtGuard } from 'src/common/guards';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('usuarios')
export class UsuariosController {
  constructor(
    private userService: UsuariosService,
    private prisma: PrismaService,
  ) {}

  @Post('/crear-usuario')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() data: Prisma.USUARIOSCreateInput) {
    return this.userService.create(data);
  }

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
  @UseGuards(AtGuard)
  @HttpCode(HttpStatus.OK)
  async infoUser(@GetCurrentUserId() userId: number, @GetCurrentUser() currentUser: any) {
    console.log('=== ENDPOINT PERFIL ===');
    console.log('Usuario ID desde token:', userId);
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

  @Get('/:id/permisos')
  async getUserPermissions(@Param('id', ParseIntPipe) userId: number) {
    return this.userService.getUserPermissions(userId);
  }

  @Post('/:id/assign-area')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async assignUserToArea(
    @Param('id', ParseIntPipe) userId: number,
    @Body() assignAreaDto: AssignAreaDto,
  ) {
    return this.userService.assignUserToArea(userId, assignAreaDto.areaId, assignAreaDto.rolArea);
  }

  @Delete('/:id/remove-area/:areaId')
  async removeUserFromArea(
    @Param('id', ParseIntPipe) userId: number,
    @Param('areaId', ParseIntPipe) areaId: number,
  ) {
    return this.userService.removeUserFromArea(userId, areaId);
  }

  @Get('/my-permissions')
  async getMyPermissions(@GetCurrentUserId() userId: number) {
    return this.userService.getUserPermissions(userId);
  }

  @Get('/get-areas')
  async getAreas() {
    console.log('====');
    return this.userService.getAreas();
  }

  @Get('/with-modules')
  async getAreasWithModules() {
    return this.userService.getAreasWithModules();
  }
}
