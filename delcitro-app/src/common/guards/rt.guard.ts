import { AuthGuard } from '@nestjs/passport';

export class RtGuad extends AuthGuard('jwt-refresh') {
  constructor() {
    super();
  }
}
