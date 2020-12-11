import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { PythonShell } from 'python-shell';
import * as crypto from 'crypto';
import * as FormData from 'form-data';
import fetch from 'node-fetch';
import { AcrCloudDto, AcrResult } from '../model/acr-cloud-dto';
import { AcrEmptyResponseError, FingerprintCreationError } from '../model/errors';
import { FingerprintData } from '../model/fingerprint-data';

@Injectable()
export class AcrCloudFileService {

  constructor(private readonly configService: ConfigService) {
  }

  private static buildStringToSign(method: string, uri: string, accessKey: string, dataType: string,
                                   signatureVersion: string, timestamp: string): string {
    return [method, uri, accessKey, dataType, signatureVersion, timestamp].join('\n');
  }

  public static sign(signString: string, accessSecret: string) {
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

  public async identify(audioFilePath: string): Promise<AcrResult> {
    const timestamp = new Date().getTime() / 1000;
    const options = {
      host: this.configService.get<string>('acr_cloud.host'),
      endpoint: this.configService.get<string>('acr_cloud.endpoint'),
      accessKey: this.configService.get<string>('acr_cloud.access_key'),
      dataType: this.configService.get<string>('acr_cloud.data_type'),
      signatureVersion: this.configService.get<string>('acr_cloud.signature_version'),
      accessSecret: this.configService.get<string>('acr_cloud.secret_key')
    };

    const stringToSign = AcrCloudFileService.buildStringToSign('POST',
      options.endpoint,
      options.accessKey,
      options.dataType,
      options.signatureVersion,
      timestamp.toString());

    const signature = AcrCloudFileService.sign(stringToSign, options.accessSecret);
    const fingerprint = await this.createFingerprint(audioFilePath);
    const form = AcrCloudFileService.createFormData(fingerprint.data, options.accessKey, options.dataType,
      options.signatureVersion, signature, timestamp);

    try {
      const response = await fetch(`http://${options.host}${options.endpoint}`,
        { method: 'POST', body: form });
      const responseData = await response.json();
      return new AcrResult(responseData as AcrCloudDto, fingerprint.fileDuration);
    } catch (e) {
      return Promise.reject(new AcrEmptyResponseError(`ACR service retrieval failed. Reason: ${e}`));
    }
  }

  private createFingerprint(audioInputPath: string): Promise<FingerprintData> {
    const scriptPath = this.configService.get<string>('acr_cloud.fingerprint_script_path');
    return new Promise<FingerprintData>((resolve, reject) => {
      PythonShell.run(scriptPath, {
        args: [audioInputPath]
      }, (err, output) => {
        if (err) {
          reject(new FingerprintCreationError(`Fingerprint could not be created ` +
            `for file ${audioInputPath} with ${err}`));
        }
        if (!output) {
          reject(new FingerprintCreationError(`Fingerprint could not be created for file ${audioInputPath}`));
        }
        if (output.length <= 1) {
          reject(new FingerprintCreationError(`Fingerprint could not be created` +
            `because audio file was only ${output[0]} seconds long.`));
        }
        const duration = Number.parseInt(output[0]);
        const data = output.filter((_, index) => index !== 0);
        resolve(new FingerprintData(duration, data));
      });
    });
  }
}
