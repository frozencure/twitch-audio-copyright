import { getClipUrl } from './url.manager';

describe('utils', () => {
  it('should convert to mp4 url', () => {
    expect(getClipUrl('https://clips-media-assets2.twitch.tv/vod-802800444-offset-92-preview-260x147.jpg')).toEqual('https://clips-media-assets2.twitch.tv/vod-802800444-offset-92.mp4');
  });
});
