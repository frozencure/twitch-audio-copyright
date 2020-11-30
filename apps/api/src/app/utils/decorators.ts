import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserCookieModel } from '../auth/model/user-cookie-model';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const userString = request.cookies.user;
    return JSON.parse(userString) as UserCookieModel;
  }
);

export const Token = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.cookies.token;
  }
);
