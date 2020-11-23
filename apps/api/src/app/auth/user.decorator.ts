import { createParamDecorator, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { UserCookieModel } from './model/user-cookie-model';

export const UserCookie = createParamDecorator<UserCookieModel>(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (!request.cookies || !request.cookies.user) {
      throw new HttpException({
        status: HttpStatus.UNAUTHORIZED,
        error: 'Unauthorized. Missing user cookie.'
      }, HttpStatus.UNAUTHORIZED);
    }
    return request.cookies.user as UserCookieModel;
  }
);
