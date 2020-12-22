import { HelixVideoData } from 'twitch/lib/API/Helix/Video/HelixVideo';
import { TwitchVideoDto } from '../..';

export interface VideoDownloadRequestModel {
  videos: TwitchVideoDto[]
}
