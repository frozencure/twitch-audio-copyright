import { Injectable } from '@angular/core';
import { HttpService } from '@nestjs/common';
import { AddStreamModel } from '../model/AddStreamModel';
import { ConfigService } from '@nestjs/config';
import { AcrCloudFileService } from '../files/acr-cloud-file.service';
import fetch from 'node-fetch';
import { StreamMonitorDto } from '../model/stream-monitor-dto';


@Injectable()
export class AcrCloudMonitorService {

  private static BaseUrl = 'https://api.acrcloud.com/v1/monitor-streams';
  private projectName = this.configService.get<string>('acr_cloud.monitor_project_name');
  private region = this.configService.get<string>('acr_cloud.monitor_region');

  constructor(private httpService: HttpService,
              private configService: ConfigService) {
  }

  private buildStringToSign(httpMethod: string, timestamp: string): string {
    return [httpMethod, '/v1/monitor-streams',
      this.configService.get<string>('acr_cloud.monitor_access_key'),
      this.configService.get<string>('acr_cloud.signature_version'),
      timestamp].join('\n');
  }

  private signature(httpMethod: string, timestamp: string): string {
    const accessSecret = this.configService.get<string>('acr_cloud.monitor_secret');
    const toSign = this.buildStringToSign(httpMethod, timestamp);
    return AcrCloudFileService.sign(toSign, accessSecret);
  }

  private headers(method: string): unknown {
    const timestamp = new Date().getTime() / 100;
    return {
      signature: this.signature(method, timestamp.toString()),
      'signature-version': '1',
      'access-key': this.configService.get<string>('acr_cloud.monitor_access_key'),
      timestamp: timestamp.toString()
    };
  }

  async addStream(url: string, streamName: string,
                  isRealTime = false, isRecorded = false): Promise<StreamMonitorDto> {
    const isRealTimeNumber = isRealTime ? 1 : 0;
    const isRecordedNumber = isRecorded ? 1 : 0;
    const model = new AddStreamModel(url, streamName, this.projectName, this.region,
      isRealTimeNumber, isRecordedNumber);
    try {
      const response = await fetch(AcrCloudMonitorService.BaseUrl,
        {
          method: 'POST',
          body: model.toForm(),
          headers: this.headers('POST')
        });
      return await response.json();
    } catch (e) {
      console.log(e);
    }
  }
}
