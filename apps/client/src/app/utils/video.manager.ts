import { TwitchVideoDto } from '../shared/model/TwitchVideoDto';
import { TwitchClipDto } from '@twitch-audio-copyright/data';
import { HelixVideo } from 'twitch';

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

export const getMillisFromString = (duration: string) => {
  const hours = duration.slice(0, duration.indexOf('h'));
  const minutes = duration.slice(duration.indexOf('h') + 1, duration.indexOf('m'));
  const seconds = duration.slice(duration.indexOf('m') + 1, duration.indexOf('s'));
  return parseInt(hours, 10) * 1000 * 60 * 60 + parseInt(minutes) * 1000 * 60 + parseInt(seconds) * 1000;
};

export const getStringFromMilliseconds = (milliseconds: number) => {
  let minutes, seconds, result = '';
  const totalSeconds = milliseconds / 1000;
  const totalMinutes = totalSeconds / 60;
  const totalHours = totalMinutes / 60;

  seconds = Math.floor(totalSeconds) % 60;
  minutes = Math.floor(totalMinutes) % 60;
  const hours = Math.floor(totalHours) % 60;

  if (hours !== 0) {
    result += hours + ':';

    if (minutes.toString().length == 1) {
      minutes = '0' + minutes;
    }
  }
  result += minutes + ':';

  if (seconds.toString().length == 1) {
    seconds = '0' + seconds;
  }

  result += seconds;
  return result;
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

export const videoThumbnailUrl = (thumbnailUrl: string, pixels: string) => {
  return thumbnailUrl.replace(/%{[a-zA-Z]*}/g, pixels);
};

export const clipThumbnailUrl = (thumbnailUrl: string, pixels: string) => {
  return thumbnailUrl.replace(/\d+x\d+/g, `${pixels}x${pixels}`)
}

export const videoCompareViews = (a: HelixVideo, b: HelixVideo) => {
  if (a.views === b.views) return 0;
  return a.views > b.views ? 1 : -1;
}

export const videoCompareTime = (a: HelixVideo, b: HelixVideo) => {
  if (a.publishDate === b.publishDate) return 0;
  return a.publishDate > b.publishDate ? 1 : -1;
}

export const videoCompareDuration = (a: HelixVideo, b: HelixVideo) => {
  if (a.durationInSeconds === b.durationInSeconds) return 0;
  return a.durationInSeconds > b.durationInSeconds ? 1 : -1;
}
