import { Injectable } from '@angular/core';
import { AddStreamModel } from '../model/add-stream-model';
import { ConfigService } from '@nestjs/config';
import { AcrCloudFileService } from '../files/acr-cloud-file.service';
import fetch from 'node-fetch';
import { StreamMonitorDto } from '../model/stream-monitor-dto';
import { AcrStatusResponseError } from '../model/errors';
import { AcrCloudLiveResultDto } from '../model/monitor/acr-cloud-live-result-dto';

@Injectable()
export class AcrCloudMonitorService {

  private static BaseUrl = 'https://api.acrcloud.com/v1/monitor-streams';
  private projectName = this.configService.get<string>('acr_cloud.monitor_project_name');
  private region = this.configService.get<string>('acr_cloud.monitor_region');

  constructor(private configService: ConfigService) {
  }

  private buildStringToSign(httpMethod: string, timestamp: string, streamId?: string): string {
    const url = streamId ? `/v1/monitor-streams/${streamId}` : `/v1/monitor-streams`;
    return [httpMethod, url,
      this.configService.get<string>('acr_cloud.monitor_access_key'),
      this.configService.get<string>('acr_cloud.signature_version'),
      timestamp].join('\n');
  }

  private signature(httpMethod: string, timestamp: string, streamId?: string): string {
    const accessSecret = this.configService.get<string>('acr_cloud.monitor_secret');
    const toSign = this.buildStringToSign(httpMethod, timestamp, streamId);
    return AcrCloudFileService.sign(toSign, accessSecret);
  }

  private headers(method: string, streamId?: string): unknown {
    const timestamp = new Date().getTime() / 100;
    return {
      signature: this.signature(method, timestamp.toString(), streamId),
      'signature-version': '1',
      'access-key': this.configService.get<string>('acr_cloud.monitor_access_key'),
      timestamp: timestamp.toString()
    };
  }

  async addStream(url: string, streamName: string,
                  isRealTime: boolean, isRecorded: boolean): Promise<StreamMonitorDto> {
    const isRealTimeNumber = isRealTime ? 1 : 0;
    const isRecordedNumber = isRecorded ? 1 : 0;
    const model = new AddStreamModel(url, streamName, this.projectName, this.region,
      isRealTimeNumber, isRecordedNumber);
    const response = await fetch(AcrCloudMonitorService.BaseUrl,
      {
        method: 'POST',
        body: model.toForm(),
        headers: this.headers('POST')
      });
    const responseData = await response.json();
    if (response.status !== 201) {
      throw new AcrStatusResponseError(`Could not add ACR stream. Reason: ${responseData}`);
    }
    return responseData;
  }

  async getStream(streamId: string): Promise<StreamMonitorDto> {
    const headers = this.headers('GET', streamId);
    const response = await fetch(`${AcrCloudMonitorService.BaseUrl}/${streamId}`,
      {
        method: 'GET',
        headers: headers
      });
    const responseData = await response.json();
    if (response.status !== 200) {
      throw new AcrStatusResponseError(`Could not retrieve ACR data. Reason: ${responseData}`);
    }
    return responseData;
  }

  async deleteStream(streamId: string): Promise<boolean> {
    const response = await fetch(`${AcrCloudMonitorService.BaseUrl}/${streamId}`,
      {
        method: 'DELETE',
        headers: this.headers('DELETE', streamId)
      });
    if (response.status !== 204) {
      const responseData = await response.json();
      throw new AcrStatusResponseError(`Could not delete ACR stream. Reason: ${responseData}`);
    }
    return true;
  }

  async getResultsByDate(date: Date, streamId: string): Promise<AcrCloudLiveResultDto[]> {
    const accessKey = this.configService.get<string>('acr_cloud.monitor_results_access_key');
    const response = await fetch(`${AcrCloudMonitorService.BaseUrl}/${streamId}` +
      `/results?access_key=${accessKey}&date=${AcrCloudMonitorService.formatDate(date)}`, {
      method: 'GET'
    });
    const responseData = await response.json();
    if (response.status !== 200) {
      throw new AcrStatusResponseError(`Could not retrieve ACR results. Reason: ${responseData}`);
    }
    return responseData.map(r => {
      const song = Object.assign(new AcrCloudLiveResultDto(), r);
      song.metadata.timestamp_utc = new Date(r.metadata.timestamp_utc);
      return song;
    });
  }

  private static formatDate(date: Date): string {
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const monthString = month < 10 ? '0' + month.toString() : month.toString();
    const day = date.getUTCDate();
    const dayString = day < 10 ? '0' + day.toString() : day.toString();
    return `${year}${monthString}${dayString}`;
  }
}
