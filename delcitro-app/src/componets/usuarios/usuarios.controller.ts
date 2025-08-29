import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Public } from 'src/common/decorators';
import { UsuariosService } from './usuarios.service';
import { FindUserDto } from '../models/Usuario.model';

@Controller('usuarios')
export class UsuariosController {
  constructor(private userService: UsuariosService) {}

  @Public()
  @Post('/profile')
  @HttpCode(HttpStatus.OK)
  infoUser(@Body() dto: FindUserDto) {
    console.log('Entrando info usuario:', dto.usuario);
    return this.userService.infoUserProfile(dto.usuario);
  }
}
