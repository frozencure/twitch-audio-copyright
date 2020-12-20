export class TimeConversion {

  static secondsToHoursMinutesSeconds(seconds: number, alwaysDisplayHours = false): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor(seconds % 3600 / 60);
    const remainingSeconds = Math.floor(seconds % 3600 % 60);

    let hoursDisplay = hours > 0 ? hours.toString() + ':' : ':';
    if(alwaysDisplayHours) {
      hoursDisplay = hours > 0 ? hours.toString() + ':' : '0:';
    }
    const minutesDisplay =
      minutes > 0 ? (minutes > 9 ? minutes.toString() : '0' + minutes.toString()) + ':' : '00:';
    const secondsDisplay = remainingSeconds > 0 ?
      (remainingSeconds > 9 ? remainingSeconds.toString() : '0' + remainingSeconds.toString()) : '00';
    return hoursDisplay + minutesDisplay + secondsDisplay;
  }

  static secondToTwitchVodTimestamp(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor(seconds % 3600 / 60);
    const remainingSeconds = Math.floor(seconds % 3600 % 60);
    const hoursString = hours > 0 ? hours.toString() + 'h' : '';
    const minutesString = minutes > 0 ? minutes.toString() + 'm' : '';
    const secondsString = remainingSeconds > 0 ? remainingSeconds.toString() + 's' : '';
    return hoursString + minutesString + secondsString;
  }
}
