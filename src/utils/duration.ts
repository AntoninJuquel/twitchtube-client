import {
  secondsToHours,
  secondsToMinutes,
  hoursToMinutes,
  minutesToSeconds,
} from 'date-fns';

export function formatDuration(num: number | string): string {
  return num.toString().padStart(2, '0');
}

export function durationString(duration: number) {
  const hours = secondsToHours(duration);
  const minutes = secondsToMinutes(duration) - hoursToMinutes(hours);
  const seconds = duration - minutesToSeconds(minutes);

  return `${formatDuration(hours)} : ${formatDuration(
    minutes
  )} : ${formatDuration(seconds.toFixed())}`;
}
