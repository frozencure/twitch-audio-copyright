import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';

@Catch()
export class ServeStaticExceptionFilter implements ExceptionFilter {

  catch(exception: unknown, host: ArgumentsHost) {
    if (exception instanceof HttpException && exception.getStatus() === 404) {
      host.switchToHttp().getResponse().send('<!DOCTYPE html>\n' +
        '<html>\n' +
        '<head>\n' +
        '  <meta charset="utf-8" />\n' +
        '  <title>App</title>\n' +
        '  <link rel="stylesheet" href="styles/styles.css">\n' +
        '</head>\n' +
        '<body>\n' +
        `${exception.getStatus()}\n` +
        '</body>\n' +
        '</html>\n');
    }
  }
}
