export const getClipUrl = (thumbnailUrl: string) => {
  return thumbnailUrl.substring(0, thumbnailUrl.indexOf('-preview')).concat('.mp4');
};
