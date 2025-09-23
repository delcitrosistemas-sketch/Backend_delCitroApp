import {
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { GetCurrentUser, GetCurrentUserId, Public } from 'src/common/decorators';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { Tokens } from './types';
import { RtGuad } from 'src/common/guards';
import type { Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import type { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  @Public()
  @Post('/local/signup')
  @HttpCode(HttpStatus.CREATED)
  signupLocal(@Body() dto: AuthDto): Promise<Tokens> {
    console.log('Entrando a auth/local/signup');
    return this.authService.signupLocal(dto);
  }

  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  async logout(@GetCurrentUserId() user: number, @Res({ passthrough: true }) res: Response) {
    await this.authService.logout(user);
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');

    return { message: 'Logout exitoso' };
  }

  @Post('/local/refresh')
  @UseGuards(RtGuad)
  async refreshTokens(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') rt: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.refreshTokens2(userId, rt);

    // Actualizar cookie con nuevo refresh_token
    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/', // CAMBIO: path a '/' en lugar de '/auth/local/refresh'
      maxAge: 7 * 24 * 60 * 60 * 1000, // CORREGIDO: faltaba * 1000
    });

    // Actualizar cookie de access_token
    res.cookie('access_token', tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/', // CAMBIO: mantener path '/'
      maxAge: 1000 * 60 * 5, // 5 minutos
    });

    return { message: 'Token refreshed' };
  }

  @Public()
  @Post('/local/signIn')
  @HttpCode(HttpStatus.OK)
  async signInLocal(@Body() dto: AuthDto, @Res({ passthrough: true }) res: Response) {
    console.log('Entrando a login', dto);
    const user = await this.prisma.uSUARIOS.findUnique({
      where: { usuario: dto.usuario },
    });

    console.log('usuario', user);

    if (!user) throw new UnauthorizedException('Usuario no encontrado');

    const passwordMatches = await bcrypt.compare(dto.password, user.hash);
    if (!passwordMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.authService.signinLocal(dto);
    await this.authService.updateRefreshToken(user.id, tokens.refresh_token);

    console.log('tokens', tokens.access_token, '-', tokens.refresh_token);

    // Cookie para access token
    res.cookie('access_token', tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/', // CAMBIO: path a '/' en lugar de '/auth/local/refresh'
      maxAge: 1000 * 60 * 5, // 5 min
    });

    // Cookie para refresh token
    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/', // CAMBIO: path a '/' en lugar de '/auth/local/refresh'
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    });

    return { access_token: tokens.access_token, message: 'Login exitoso' };
  }
}
