import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode, HttpExceptionModel } from '@twitch-audio-copyright/data';

export class UnknownHttpError extends HttpException {

  private static ErrorCode = ErrorCode.UnknownError;
  private static UserMessage = 'An unknown server error occurred. Please try again later.';

  constructor(developerMessage: string, moreInfo?: string) {
    const model = new HttpExceptionModel(developerMessage, HttpStatus.INTERNAL_SERVER_ERROR,
      UnknownHttpError.UserMessage, UnknownHttpError.ErrorCode, moreInfo);
    super(model, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export class UnknownDatabaseHttpError extends HttpException {

  private static ErrorCode = ErrorCode.UnknownDatabaseError;
  private static UserMessage = 'An unknown server error occurred. Please try again later.';

  constructor(developerMessage: string, moreInfo?: string) {
    const model = new HttpExceptionModel(developerMessage, HttpStatus.INTERNAL_SERVER_ERROR,
      UnknownDatabaseHttpError.UserMessage, UnknownDatabaseHttpError.ErrorCode, moreInfo);
    super(model, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}


export class NoUserDatabaseHttpError extends HttpException {

  private static ErrorCode = ErrorCode.NoUserDatabaseError;
  private static UserMessage = 'We could not locate your Twitch user data. ' +
    'Please try logging out and in again.';

  constructor(developerMessage: string, moreInfo?: string) {
    const model = new HttpExceptionModel(developerMessage, HttpStatus.NOT_FOUND,
      NoUserDatabaseHttpError.UserMessage, NoUserDatabaseHttpError.ErrorCode, moreInfo);
    super(model, HttpStatus.NOT_FOUND);
  }
}

export class NoActiveMonitorHttpError extends HttpException {

  private static ErrorCode = ErrorCode.NoActiveMonitorError;
  private static UserMessage = 'The live-stream audio analysis feature is not currently enabled for your account. ' +
    'Please visit the Live Analysis section in order to enable it.';

  constructor(developerMessage: string, moreInfo?: string) {
    const model = new HttpExceptionModel(developerMessage, HttpStatus.NOT_FOUND,
      NoActiveMonitorHttpError.UserMessage, NoActiveMonitorHttpError.ErrorCode, moreInfo);
    super(model, HttpStatus.NOT_FOUND);
  }
}

export class AcrCloudHttpError extends HttpException {

  private static ErrorCode = ErrorCode.AcrCloudError;
  private static UserMessage = 'There was a problem with contacting the audio analysis service. ' +
    'Please try again in a few minutes.';

  constructor(developerMessage: string, moreInfo?: string) {
    const model = new HttpExceptionModel(developerMessage, HttpStatus.INTERNAL_SERVER_ERROR,
      AcrCloudHttpError.UserMessage, AcrCloudHttpError.ErrorCode, moreInfo);
    super(model, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
