import { Video } from '../shared/model/Video';
import { ClipDto } from '@twitch-audio-copyright/data';

export const withWidthAndHeight = (imageUrl: string, width: number, height: number) => {
  return imageUrl.replace('%{height}', height.toString())
    .replace('%{width}', width.toString());
};

export const views = (viewCount) => {
  const millions = viewCount / 1_000_000;
  if (millions > 1) {
    return `${millions.toFixed(1)}M views`;
  }
  const thousands = viewCount / 1_000;
  if (thousands > 1) {
    return `${thousands.toFixed(1)}K views`;
  }
  return `${viewCount} views`;
};

export const duration = (duration: string) => {
  return duration.replace('h', ':').replace('m', ':').replace('s', '');
};

export const timeSince = (createdAt) => {
  const date = new Date();
  const videoDate = new Date(createdAt);
  const timeInMilliseconds = date.getTime() - videoDate.getTime();
  const years = Math.floor(timeInMilliseconds / 1000 / 60 / 60 / 24 / 365);
  if (years > 0) {
    return (years === 1) ? `${years} year ago` : `${years} years ago`;
  }
  const months = Math.floor(timeInMilliseconds / 1000 / 60 / 60 / 24 / 30);
  if (months > 0) {
    return (months === 1) ? `${months} month ago` : `${months} months ago`;
  }
  const days = Math.floor(timeInMilliseconds / 1000 / 60 / 60 / 24);
  if (days > 0) {
    return (days === 1) ? `${days} day ago` : `${days} days ago`;
  }
  const hours = Math.floor(timeInMilliseconds / 1000 / 60 / 60);
  if (hours > 0) {
    return (hours === 1) ? `${hours} hour ago` : `${hours} hours ago`;
  } else {
    return '1 hour ago';
  }
};

export const thumbnailUrl = (thumbnailUrl: string, pixels: string) => {
  return thumbnailUrl.replace(/%{[a-zA-Z]*}/g, pixels);
};

export const videoCompareCresc = (a: Video | ClipDto, b: Video | ClipDto) => {
  if (a.view_count < b.view_count) {
    return -1;
  }
  if (a.view_count > b.view_count) {
    return 1;
  }
  return 0;
};

export const videoCompareDesc = (a: Video | ClipDto, b: Video | ClipDto) => {
  if (a.view_count > b.view_count) {
    return -1;
  }
  if (a.view_count < b.view_count) {
    return 1;
  }
  return 0;
};
