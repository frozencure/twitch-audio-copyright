import * as FormData from 'form-data';

export class AddStreamModel {
  url: string;
  stream_name: string;
  project_name: string;
  region: string;
  realtime: number;
  record: number;

  constructor(url: string, stream_name: string, project_name: string,
              region: string, realtime: number, record: number) {
    this.url = url;
    this.stream_name = stream_name;
    this.project_name = project_name;
    this.region = region;
    this.realtime = realtime;
    this.record = record;
  }

  toForm(): FormData {
    const form = new FormData();
    form.append('url', this.url);
    form.append('stream_name', this.stream_name);
    form.append('project_name', this.project_name);
    form.append('region', this.region);
    form.append('realtime', this.realtime.toString());
    form.append('record', this.record.toString());
    return form;
  }
}
