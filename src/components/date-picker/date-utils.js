/**
 * Returns day of month
 * @param {date} date
 * @returns {number}
 */
export function getDate(date) {
  return date.getDate();
}

export function getHour(date) {
  return date.getHours();
}

export function getMinute(date) {
  return date.getMinutes(date);
}

export function getStartOfDay(date) {
  date = date ? date : new Date();
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  return date;
}

export function addMinutes(date, minutes) {
  const cloneDate = new Date(date);
  return new Date(cloneDate.setMinutes(date.getMinutes() + minutes));
}

export function addHours(date, hours) {
  const cloneDate = new Date(date);
  return new Date(cloneDate.setHours(date.getHours() + hours));
}

export function addMonths(date, hours) {
  const cloneDate = new Date(date);
  return new Date(cloneDate.setMonth(date.getMonth() + hours));
}

export function formatDate(date, format) {
  switch (format) {
    case 'HH:mm':
      return `${date.getMinutes()}:${date.getSeconds()}`;
    case 'hh:mm':
      return `${date.getMinutes()}:${date.getSeconds()}`;
    case 'hh:mm A':
      return `${date.getMinutes()}:${date.getSeconds()}`;
    default:
      return date.toString();
  }
}

export function formatTime(date) {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const hourString = hours < 10 ? '0' + hours : hours;
  const minuteString = minutes < 10 ? '0' + minutes : minutes;
  return `${hourString}:${minuteString}`;
}

export function isTimeDisabled(time, disabledTimes) {
  const timeToday = getTimeToday(time);
  const l = disabledTimes.length;
  for (let i = 0; i < l; i++) {
    const disabledTimeToday = getTimeToday(disabledTimes[i]);
    if (timeToday.getTime() === disabledTimeToday.getTime()) {
      return true;
    }
  }

  return false;
}

export function isTimeInDisabledRange(time, { minTime, maxTime }) {
  if (!minTime || !maxTime) {
    throw new Error('Both minTime and maxTime props required');
  }
  const timeToday = getTimeToday(time);
  const minTimeToday = getTimeToday(minTime);
  const maxTimeDate = getTimeToday(maxTime);
  if (timeToday.getTime() > minTimeToday.getTime() && time.getTime() < maxTimeDate.getTime()) {
    return false;
  }
  return true;
}

export function getTimeToday(time) {
  let timeToday = new Date().setHours(time.getHours());
  timeToday.setMinutes(time.getMinutes())
  timeToday.setSeconds(time.getSeconds());
  return timeToday;
}

export function timesToInjectAfter(
  startOfDay,
  currentTime,
  currentMultiplier,
  intervals,
  injectedTimes
) {
  const l = injectedTimes.length;
  const times = [];
  for (let i = 0; i < l; i++) {
    const injectedTime = addMinutes(
      addHours(startOfDay, getHour(injectedTimes[i])),
      getMinute(injectedTimes[i])
    );
    const nextTime = addMinutes(
      startOfDay,
      (currentMultiplier + 1) * intervals
    );

    if (injectedTime > currentTime.getTime() && injectedTime < nextTime.getTime()) {
      times.push(injectedTimes[i]);
    }
  }

  return times;
}