import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseDatePipe implements PipeTransform<string, Date> {
  transform(value: string): Date {
    const timestamp = Date.parse(value);
    if (!timestamp || isNaN(timestamp)) {
      throw new BadRequestException(value, 'Bad Request, validation failed. ISO 8601 string is expected.');
    }
    return new Date(timestamp);
  }
}
