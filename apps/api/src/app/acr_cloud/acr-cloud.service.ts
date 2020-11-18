import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { PythonShell } from 'python-shell';
import * as crypto from 'crypto';
import * as FormData from 'form-data';
import fetch from 'node-fetch';
import { AcrCloudDto } from './model/acr-cloud-dto';

@Injectable()
export class AcrCloudService {

  constructor(private readonly configService: ConfigService) {
  }

  private static buildStringToSign(method: string, uri: string, accessKey: string, dataType: string,
                                   signatureVersion: string, timestamp: string): string {
    return [method, uri, accessKey, dataType, signatureVersion, timestamp].join('\n');
  }

  private static sign(signString: string, accessSecret: string) {
    return crypto.createHmac('sha1', accessSecret)
      .update(Buffer.from(signString, 'utf-8'))
      .digest().toString('base64');
  }

  private static createFormData(fingerprint: Array<string>, accessKey: string, dataType: string,
                                signatureVersion: string, signature: string, timestamp: number): FormData {
    const form = new FormData();
    form.append('sample', Buffer.from(fingerprint));
    form.append('sample_bytes', fingerprint.length);
    form.append('access_key', accessKey);
    form.append('data_type', dataType);
    form.append('signature_version', signatureVersion);
    form.append('signature', signature);
    form.append('timestamp', timestamp);
    return form;
  }

  public async identify(audioFilePath: string): Promise<AcrCloudDto> {
    const timestamp = new Date().getTime() / 1000;
    const options = {
      host: this.configService.get<string>('acr_cloud.host'),
      endpoint: this.configService.get<string>('acr_cloud.endpoint'),
      accessKey: this.configService.get<string>('acr_cloud.access_key'),
      dataType: this.configService.get<string>('acr_cloud.data_type'),
      signatureVersion: this.configService.get<string>('acr_cloud.signature_version'),
      accessSecret: this.configService.get<string>('acr_cloud.secret_key')
    };

    const stringToSign = AcrCloudService.buildStringToSign('POST',
      options.endpoint,
      options.accessKey,
      options.dataType,
      options.signatureVersion,
      timestamp.toString());

    const signature = AcrCloudService.sign(stringToSign, options.accessSecret);
    const fingerprint = await this.createFingerprint(audioFilePath);
    const form = AcrCloudService.createFormData(fingerprint, options.accessKey, options.dataType,
      options.signatureVersion, signature, timestamp);

    const resp = await fetch(`http://${options.host}${options.endpoint}`,
      { method: 'POST', body: form });
    return resp.json() as Promise<AcrCloudDto>;
  }

  public createFingerprint(audioInputPath: string): Promise<Array<string>> {
    const scriptPath = this.configService.get<string>('acr_cloud.fingerprint_script_path');
    return new Promise<Array<string>>((resolve, reject) => {
      PythonShell.run(scriptPath, {
        args: [audioInputPath]
      }, (err, output) => {
        if (err) {
          reject(err);
        }
        console.log(output);
        resolve(output);
      });
    });
  }
}
