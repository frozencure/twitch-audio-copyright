import { HelixBroadcasterType, HelixUserType } from 'twitch/lib/API/Helix/User/HelixUser';

export class SuccessDto {
  constructor(public message = 'success') {
  }
}

export interface ClipDto {
  'id': string,
  'url': string,
  'embed_url': string,
  'broadcaster_id': string,
  'broadcaster_name': string,
  'creator_id': string,
  'creator_name': string,
  'video_id': string,
  'game_id': string,
  'language': string,
  'title': string,
  'view_count': number,
  'created_at': string,
  'thumbnail_url': string
}

export interface TwitchUserDto {
  id: string;
  login: string;
  display_name: string;
  description: string;
  type: HelixUserType;
  broadcaster_type: HelixBroadcasterType;
  profile_image_url: string;
  offline_image_url: string;
  view_count: number;
  email: string;
}
