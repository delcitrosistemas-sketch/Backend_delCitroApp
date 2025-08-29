import { Body, Controller, HttpCode, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { GetCurrentUser, GetCurrentUserId, Public } from 'src/common/decorators';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { Tokens } from './types';
import { RtGuad } from 'src/common/guards';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('/local/signup')
  @HttpCode(HttpStatus.CREATED)
  signupLocal(@Body() dto: AuthDto): Promise<Tokens> {
    console.log('Entrando a auth/local/signup');
    return this.authService.signupLocal(dto);
  }

  @Public()
  @Post('/local/signin')
  @HttpCode(HttpStatus.OK)
  async signinLocal(@Body() dto: AuthDto, @Res({ passthrough: true }) res: Response) {
    const tokens = await this.authService.signinLocal(dto);
    console.log('Entrando a /local/signin');
    res.cookie('access_token', tokens.access_token, {
      httpOnly: true,
      //secure: process.env.NODE_ENV === 'production',
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 1000 * 60 * 15,
    });

    return { message: 'Login exitoso' };
  }

  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  async logout(@GetCurrentUserId() user: number, @Res({ passthrough: true }) res: Response) {
    console.log('Entrando a auth/local/logout');
    console.log(' 0 0 0 0 ' + user);
    await this.authService.logout(user);
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');

    return { message: 'Logout exitoso' };
  }

  @Public()
  @UseGuards(RtGuad)
  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ) {
    console.log('Entrando a auth/local/refersh');

    return this.authService.refreshTokens(userId, refreshToken);
  }
}
