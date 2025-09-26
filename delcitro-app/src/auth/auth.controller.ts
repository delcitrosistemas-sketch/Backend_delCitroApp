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
import type { Response, Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
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
    return this.authService.signupLocal(dto);
  }

  @Public()
  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  async logout(@GetCurrentUserId() user: number, @Res({ passthrough: true }) res: Response) {
    await this.authService.logout(user);
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    return { message: 'Logout exitoso' };
  }

  @Public()
  @Post('/local/refresh')
  @UseGuards(RtGuad)
  async refreshTokens(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') rt: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.refreshTokens(userId, rt);
    return tokens;
  }

  @Public()
  @Post('/local/signIn')
  @HttpCode(HttpStatus.OK)
  async signInLocal(@Body() dto: AuthDto, @Req() req: Request) {
    console.log('Iniciando sesión para:', dto.usuario);

    const user = await this.prisma.uSUARIOS.findUnique({
      where: { usuario: dto.usuario },
    });

    if (!user) throw new UnauthorizedException('Usuario no encontrado');

    const passwordMatches = await bcrypt.compare(dto.password, user.hash);
    if (!passwordMatches) throw new ForbiddenException('Credenciales inválidas');

    const tokens = await this.authService.signinLocal(dto);
    await this.authService.updateRtHash(user.id, tokens.refresh_token);

    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      token_type: 'Bearer',
      expires_in: 60 * 60,
      message: 'Login exitoso',
    };
  }
}
