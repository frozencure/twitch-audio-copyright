import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class ServeStaticExceptionFilter implements ExceptionFilter {

  catch(exception: HttpException, host: ArgumentsHost) {
    host.switchToHttp().getResponse().status(exception.getStatus()).send('<!DOCTYPE html>\n' +
      '<html>\n' +
      '<head>\n' +
      '  <meta charset="utf-8" />\n' +
      '  <title>App</title>\n' +
      '  <link rel="stylesheet" href="styles/styles.css">\n' +
      '</head>\n' +
      '<body>\n' +
      '404\n' +
      '</body>\n' +
      '</html>\n');
  }
}
