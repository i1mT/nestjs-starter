import * as dayjs from 'dayjs';

export function currentTime() {
  return dayjs().toDate();
}
