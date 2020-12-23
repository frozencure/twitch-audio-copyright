import { ErrorCode } from './error-code';

export class HttpExceptionModel {
  developerMessage: string;
  status: number;
  userMessage: string;
  errorCode: ErrorCode;
  moreInfo?: string;

  constructor(developerMessage: string, status: number, userMessage: string, errorCode: ErrorCode, moreInfo?: string) {
    this.developerMessage = developerMessage;
    this.userMessage = userMessage;
    this.errorCode = errorCode;
    this.moreInfo = moreInfo;
    this.status = status;
  }
}
