import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import * as fs from 'fs';
import { Logger } from '@nestjs/common';

@Processor('file-system')
export class FileSystemProcessor {

  @Process('delete-file')
  deleteFile(job: Job<string>): void {
    if (fs.existsSync(job.data)) {
      fs.unlink(job.data, err => {
        if (err) {
          Logger.error(`File could not be deleted. Error: ${err}`);
        }
      });
    }
  }


}
