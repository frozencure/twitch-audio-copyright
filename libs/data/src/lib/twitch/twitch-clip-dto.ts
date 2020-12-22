import { HelixClip } from 'twitch';

export interface TwitchClipDto {
  'id': string,
  'url': string,
  'embed_url': string,
  'broadcaster_id': string,
  'broadcaster_name': string,
  'creator_id': string,
  'creator_name': string,
  'video_id': number,
  'game_id': string,
  'language': string,
  'title': string,
  'view_count': number,
  'created_at': Date,
  'thumbnail_url': string
}

export class TwitchClip implements TwitchClipDto {
  broadcaster_id: string;
  broadcaster_name: string;
  created_at: Date;
  creator_id: string;
  creator_name: string;
  embed_url: string;
  game_id: string;
  id: string;
  language: string;
  thumbnail_url: string;
  title: string;
  url: string;
  video_id: number;
  view_count: number;

  constructor(helixClip: HelixClip) {
    this.broadcaster_id = helixClip.broadcasterId;
    this.broadcaster_name = helixClip.broadcasterDisplayName;
    this.created_at = helixClip.creationDate;
    this.creator_id = helixClip.creatorId;
    this.creator_name = helixClip.creatorDisplayName;
    this.embed_url = helixClip.embedUrl;
    this.game_id = helixClip.gameId;
    this.id = helixClip.id;
    this.language = helixClip.language;
    this.thumbnail_url = helixClip.thumbnailUrl;
    this.title = helixClip.title;
    this.url = helixClip.url;
    this.video_id = Number.parseInt(helixClip.videoId);
    this.view_count = helixClip.views;
  }

}
