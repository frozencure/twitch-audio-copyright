import {
  getMillisFromString,
  getStringFromMilliseconds,
  videoSquareThumbnailUrl,
  videoCompareCresc,
  videoCompareDesc
} from './video.manager';

const thumbnailUrlExample = 'https://static-cdn.jtvnw.net/cf_vods/d2nvs31859zcd8/e46e52a31f17c495f33c_frozencure_39983712652_1605362913//thumb/thumb0-%{width}x%{height}.jpg';
const videos = [
  {
    'id': '802730994',
    'view_count': 2
  },
  {
    'id': '802800444',
    'view_count': 1
  },
  {
    'id': '794175057',
    'view_count': 2
  }
];
describe('VideoManager', () => {
  it('should create the thumbnail correctly', () => {
    expect(videoSquareThumbnailUrl(thumbnailUrlExample, '32')).toEqual('https://static-cdn.jtvnw.net/cf_vods/d2nvs31859zcd8/e46e52a31f17c495f33c_frozencure_39983712652_1605362913//thumb/thumb0-32x32.jpg');
  });

  it('should sort cresc', () => {
    const sorted = videos.sort(videoCompareCresc).map(item => item.id);
    expect(sorted).toEqual(['802800444', '802730994', '794175057']);
  });

  it('should sort', () => {
    const sorted = videos.sort(videoCompareDesc).map(item => item.id);
    expect(sorted).toEqual(['802730994', '794175057', '802800444']);
  });

  it('should get the millis', () => {
    expect(getMillisFromString('1h30m26s')).toEqual(5426000);
  });

  it('should get the string from millis', () => {
    expect(getStringFromMilliseconds(5426000)).toEqual('1:30:26');
  });
});
