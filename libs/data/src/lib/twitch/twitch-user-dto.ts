import { HelixBroadcasterType, HelixUserType } from 'twitch/lib/API/Helix/User/HelixUser';

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
