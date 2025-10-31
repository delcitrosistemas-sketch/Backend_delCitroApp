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
import { UsuariosService } from './usuarios.service';
import { GetCurrentUser, GetCurrentUserId } from '../../common/decorators';
import { Prisma } from '@prisma/client';
import { AssignAreaDto } from '../../auth/dto';
import { AtGuard } from '../../common/guards';
import { PrismaService } from '../../prisma/prisma.service';
import * as multer from 'multer';
import { CloudinaryService } from '../../cloudinary/cloudinary.service';

@Controller('usuarios')
export class UsuariosController {
  constructor(
    private userService: UsuariosService,
    private prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
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
  @Get('/get-areas')
  @HttpCode(HttpStatus.OK)
  async getAreas() {
    return this.userService.getAreas();
  }

  @Get('/get-modulos')
  @HttpCode(HttpStatus.OK)
  async getModulos() {
    return this.userService.getModulos();
  }

  @Get('/my-permissions')
  @HttpCode(HttpStatus.OK)
  async getMyPermissions(@GetCurrentUserId() userId: number) {
    return this.userService.getUserPermissions(userId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Get('/with-modules')
  @HttpCode(HttpStatus.OK)
  async getAreasWithModules() {
    return this.userService.getAreasWithModules();
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: Prisma.USUARIOSUpdateInput) {
    return this.userService.update(id, data);
  }

  @Delete('/eliminar/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }

  @Post('/perfil')
  @UseGuards(AtGuard)
  @HttpCode(HttpStatus.OK)
  async infoUser(@GetCurrentUserId() userId: number, @GetCurrentUser() currentUser: any) {
    return this.userService.infoUserProfileById(userId);
  }

  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.memoryStorage(), // No escribe en disco
    }),
  )
  @Post('upload')
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const result = await this.cloudinaryService.uploadImage(file);
    return {
      message: 'Archivo subido correctamente a Cloudinary',
      url: result.secure_url,
      public_id: result.public_id,
    };
  }

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

  @Put('/actualizar/:id')
  async actualizarUsuario(@Param('id') id: string, @Body() updateData: any) {
    return this.userService.updateUsuario(parseInt(id), updateData);
  }
}
