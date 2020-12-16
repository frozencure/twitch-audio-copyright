export class StreamMonitor {
  id: number;
  acrId: string;
  url: string;
  name: string;
  isRealTime: boolean;
  isRecorded: boolean;
  activatedAt: Date;
  deactivatedAt?: Date;
  state?: string;
}
