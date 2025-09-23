import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable, UnauthorizedException } from '@nestjs/common';

type JwtPayload = {
  sub: number;
  usuario: string;
};

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(req: Request) => req?.cookies?.access_token || null]),
      secretOrKey: 'at-secret',
    });
  }

  validate(payload: JwtPayload) {
    if (!payload) throw new UnauthorizedException('Token inválido');
    return payload;
  }
}
