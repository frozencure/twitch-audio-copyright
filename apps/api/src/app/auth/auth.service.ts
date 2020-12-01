import { ForbiddenException, HttpService, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import fetch, { RequestInit } from 'node-fetch';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {

  constructor(private httpService: HttpService, private config: ConfigService) {
  }

  public async revokeToken(accessToken: string): Promise<any> {
    return await this.httpService.post('https://id.twitch.tv/oauth2/revoke', null, {
      params: {
        client_id: this.config.get('CLIENT_ID'),
        token: accessToken
      },
      headers: {
        Accept: '*/*'
      }
    }).toPromise();

  }

  public async validateToken(accessToken: string): Promise<boolean> {
    const request = this.createRequestInit(accessToken);
    let response;
    try {
      response = await fetch('https://id.twitch.tv/oauth2/validate', request);
    } catch (err) {
      Logger.error(err);
      throw new ForbiddenException('NO_CON');
    }
    const body = await response.json();
    if (body.status >= 400) {
      throw new UnauthorizedException(
        `Invalid Token`);
    } else {
      return true;
    }
  }

  private createRequestInit(authToken?: string): RequestInit {
    const requestInit = {
      method: 'GET',
      headers: {
        Accept: '*/*',
        'Authorization': `OAuth ${authToken}`
      }
    } as RequestInit;

    return requestInit;
  }
}
