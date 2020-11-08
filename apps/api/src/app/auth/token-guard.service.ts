import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(private authService: AuthService) {
  }

  async canActivate(
    context: ExecutionContext
  ): Promise<boolean> {

    const request: Request = context.switchToHttp().getRequest();
    if (!request.cookies || !request.cookies.token) {
      throw new HttpException({ status: HttpStatus.UNAUTHORIZED, error: 'User unauthorized' }, HttpStatus.UNAUTHORIZED);
    }
    let valid;
    try {
      valid = await this.authService.validateToken(request.cookies.token);
    } catch (err) {
      Logger.log(err);
      throw new HttpException({ status: HttpStatus.UNAUTHORIZED, error: 'User unauthorized' }, HttpStatus.UNAUTHORIZED);
    }
    if (!valid) {
      throw new HttpException({ status: HttpStatus.UNAUTHORIZED, error: 'User unauthorized' }, HttpStatus.UNAUTHORIZED);
    }
    return valid;
  }
}
