import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

export const GetCurrentUserId = createParamDecorator(
  (data: undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    if (!request.user) throw new UnauthorizedException('No user found in request');
    return request.user['sub'];
  },
);
