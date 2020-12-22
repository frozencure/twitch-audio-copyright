import { HelixVideo } from 'twitch';
import { VideoType } from '../video';

export interface TwitchVideoDto {
  id: number,
  user_id: string,
  user_name: string,
  title: string,
  description: string,
  created_at: Date,
  published_at: Date,
  url: string,
  thumbnail_url: string,
  viewable: string,
  view_count: number,
  language: string,
  type: VideoType,
  duration: string,
  durationInSeconds: number
}

export class TwitchVideo implements TwitchVideoDto {
  created_at: Date;
  description: string;
  duration: string;
  id: number;
  language: string;
  published_at: Date;
  thumbnail_url: string;
  title: string;
  type: VideoType;
  url: string;
  user_id: string;
  user_name: string;
  view_count: number;
  viewable: string;
  durationInSeconds: number;

  constructor(helixVideo: HelixVideo) {
    this.created_at = helixVideo.creationDate;
    this.description = helixVideo.description;
    this.duration = helixVideo.duration;
    this.id = Number.parseInt(helixVideo.id);
    this.language = helixVideo.language;
    this.published_at = helixVideo.publishDate;
    this.thumbnail_url = helixVideo.thumbnailUrl;
    this.title = helixVideo.title;
    this.type = VideoType[helixVideo.type.toUpperCase()];
    this.url = helixVideo.url;
    this.user_id = helixVideo.userId;
    this.user_name = helixVideo.userDisplayName;
    this.view_count = helixVideo.views;
    this.viewable = helixVideo.isPublic ? 'public' : 'private';
    this.durationInSeconds = helixVideo.durationInSeconds;
  }
}
