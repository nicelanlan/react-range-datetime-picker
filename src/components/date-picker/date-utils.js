import dateformat from 'dateformat';

const dayOfWeekCodes = {
  0: 'sun',
  1: 'mon',
  2: 'tue',
  3: 'wed',
  4: 'thu',
  5: 'fri',
  6: 'sat',
};
const dayOfWeekCodesMin = {
  0: 'Su',
  1: 'Mo',
  2: 'Tu',
  3: 'We',
  4: 'Th',
  5: 'Fr',
  6: 'Sa',
};
const dayOfWeekCodesShort = {
  0: 'Sun',
  1: 'Mon',
  2: 'Tue',
  3: 'Wed',
  4: 'Thu',
  5: 'Fri',
  6: 'Sat',
};

export function getTimeByDate(date) {
  if (!date) {
    return 0;
  }
  const dateClone = cloneDate(date);
  return setTime(dateClone, {
    hour: 0,
    minute: 0,
    second: 0,
  }).getTime();
}

export function newDate(point) {
  return point ? new Date(point) : new Date();
}

export function now(maybeFixedUtcOffset) {
  if (maybeFixedUtcOffset == null) {
    return new Date();
  }
  return new Date(new Date().setMinutes(new Date().getMinutes() + maybeFixedUtcOffset));
}

export function cloneDate(date) {
  return new Date(date);
}

export function parseDate(value, { dateFormat, locale }) {
  let m = Date.parse(value);
  if (isNaN(m)) {
    m = new Date(value.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$2/$1/$3'));
  }
  return isNaN(m) ? null : m;
}

export function isMoment(date) {
  return false;
}

export function isDate(date) {
  return parseDate(date) !== null;
}

export function formatDate(date, format) {
  return dateformat(date, format);
}

export function safeDateFormat(date, { dateFormat, locale }) {
  return (date && dateformat(date, Array.isArray(dateFormat) ? dateFormat[0] : dateFormat)) || '';
}

export function setTime(date, { hour, minute, second }) {
  date.setHours(hour || 0);
  date.setMinutes(minute || 0);
  date.setSeconds(second || 0);
  return new Date(date);
}

export function setMonth(date, month) {
  date.setMonth(month);
  return new Date(date);
}

export function setYear(date, year) {
  date.setYear(year);
  return new Date(date);
}

export function setUTCOffset(date, offset) {
  date.setMinutes(date.getMinutes() + offset);
  return new Date(date);
}

export function getSecond(date) {
  return date.getSeconds();
}

export function getMinute(date) {
  return date.getMinutes(date);
}

export function getHour(date) {
  return date.getHours();
}

// Returns day of week
export function getDay(date) {
  return date.getDay();
}

export function getMonth(date) {
  return date.getMonth();
}

export function getYear(date) {
  return date.getYear();
}

/**
 * Returns day of month
 * @param {date} date
 * @returns {number}
 */
export function getDate(date) {
  return date.getDate();
}

export function getUTCOffset() {
  return new Date().getTimezoneOffset();
}

export function getDayOfWeekCode(day) {
  return dayOfWeekCodes[day.getDay()];
}

export function getDayOfWeekCodeMin(day) {
  return dayOfWeekCodesMin[day.getDay()];
}

export function getDayOfWeekCodeShort(day) {
  return dayOfWeekCodesShort[day.getDay()];
}

export function getStartOfDay(date) {
  date = date ? date : new Date();
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  return new Date(date);
}

export function getStartOfWeek(date) {
  date = date ? date : new Date();
  date.setDate(date.getDate() - date.getDay());
  return new Date(date);
}
export function getStartOfMonth(date) {
  date = date ? date : new Date();
  date.setDate(1);
  return new Date(date);
}

export function getStartOfDate(date) {
  date = date ? date : new Date();
  date.setDate(1);
  return new Date(date);
}

// *** End of ***

export function getEndOfWeek(date) {
  date = date ? date : new Date();
  date.setDate(date.getDate() + 7 - date.getDay());
  return new Date(date);
}

export function getEndOfMonth(date) {
  date = date ? date : new Date();
  date.setMonth(date.getMonth() + 1);
  date.setDate(0);
  return new Date(date);
}

export function addMinutes(date, amount) {
  const cloneDate = new Date(date);
  return new Date(cloneDate.setMinutes(date.getMinutes() + amount));
}

export function addHours(date, amount) {
  const cloneDate = new Date(date);
  return new Date(cloneDate.setHours(date.getHours() + amount));
}

export function addDays(date, amount) {
  const cloneDate = new Date(date);
  return new Date(cloneDate.setDate(date.getDate() + amount));
}

export function addWeeks(date, amount) {
  const cloneDate = new Date(date);
  return new Date(cloneDate.setDate(date.getDate() + amount * 7));
}

export function addMonths(date, amount) {
  const cloneDate = new Date(date);
  return new Date(cloneDate.setMonth(date.getMonth() + amount));
}

export function addYears(date, amount) {
  const cloneDate = new Date(date);
  return new Date(cloneDate.setFullYear(date.getFullYear() + amount));
}

// *** Subtraction ***
export function subtractDays(date, amount) {
  return addDays(date, -amount);
}

export function subtractWeeks(date, amount) {
  return addWeeks(date, -amount);
}

export function subtractMonths(date, amount) {
  return addMonths(date, -amount);
}

export function subtractYears(date, amount) {
  return addYears(date, -amount);
}

// ** Date Comparison **

export function isBefore(date1, date2) {
  if (date1 && !date2) {
    return false;
  }
  return date1.getTime() < date2.getTime();
}

export function isAfter(date1, date2) {
  if (date1 && !date2) {
    return false;
  }
  return date1.getTime() > date2.getTime();
}

export function isSameOrBefore(date1, date2) {
  if (date1 && !date2) {
    return true;
  }
  return date1.getTime() <= date2.getTime();
}

export function isSameOrAfter(date1, date2) {
  if (date1 && !date2) {
    return true;
  }
  return date1.getTime() >= date2.getTime();
}

export function equals(date1, date2) {
  return date1.getTime() === date2.getTime();
}

export function isSameYear(date1, date2) {
  if (date1 && date2) {
    return date1.getFullYear() === date2.getFullYear();
  } else {
    return !date1 && !date2;
  }
}

export function isSameMonth(date1, date2) {
  if (date1 && date2) {
    return date1.getMonth() === date2.getMonth();
  } else {
    return !date1 && !date2;
  }
}

export function isSameDay(moment1, moment2) {
  if (moment1 && moment2) {
    return getTimeByDate(moment1) === getTimeByDate(moment2);
  } else {
    return !moment1 && !moment2;
  }
}

export function isSameUtcOffset(moment1, moment2) {
  if (moment1 && moment2) {
    return moment1.getTimezoneOffset() === moment2.getTimezoneOffset();
  } else {
    return !moment1 && !moment2;
  }
}

export function isDayInRange(day, startDate, endDate) {
  return (startDate ? day.getTime() >= getTimeByDate(startDate) : true) && (endDate ? getTimeByDate(day) <= endDate.getTime() : true);
}

// ** Utils for some components **

export function isDayDisabled(day, { minDate, maxDate, excludeDates, includeDates } = {}) {
  let length = excludeDates ? excludeDates.length : 0;
  if (length) {
    for (let i = 0; i < length; i++) {
      if (getTimeByDate(day) === getTimeByDate(excludeDates[i])) {
        return true;
      }
    }
  }
  length = includeDates ? includeDates.length : 0;
  if (length) {
    for (let i = 0; i < length; i++) {
      if (getTimeByDate(day) === getTimeByDate(includeDates[i])) {
        return false;
      }
    }
  }
  if (isDayInRange(day, minDate, maxDate)) {
    return false;
  }
  return true;
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
  if (timeToday.getTime() >= minTimeToday.getTime() && time.getTime() <= maxTimeDate.getTime()) {
    return false;
  }
  return true;
}

export function allDaysDisabledBefore(day, unit, { minDate, includeDates } = {}) {
  const dateBefore = getEndOfMonth(subtractMonths(day, 1));
  const length = includeDates ? includeDates.length : 0;
  if (length) {
    for (let i = 0; i < length; i++) {
      if (!isBefore(dateBefore, includeDates[i])) {
        return false;
      }
    }
  }
  if (!isBefore(dateBefore, minDate)) {
    return false;
  } else {
    return true;
  }
}

export function allDaysDisabledAfter(day, unit, { maxDate, includeDates } = {}) {
  const dateAfter = getStartOfMonth(addMonths(day, 1));
  const length = includeDates ? includeDates.length : 0;
  if (length) {
    for (let i = 0; i < length; i++) {
      if (isAfter(dateAfter, includeDates[i])) {
        return false;
      }
    }
  }
  if (isAfter(dateAfter, maxDate)) {
    return true;
  }
  return false;
}

export function getEffectiveMinDate({ minDate, includeDates }) {
  const length = includeDates ? includeDates.length : 0;
  let result = minDate;
  if (length) {
    includeDates.forEach(item => {
      if (isBefore(item, result)) {
        result = item;
      }
    });
  }
  return result;
}

export function getEffectiveMaxDate({ maxDate, includeDates }) {
  const length = includeDates ? includeDates.length : 0;
  let result = maxDate;
  if (length) {
    includeDates.forEach(item => {
      if (isAfter(item, result)) {
        result = item;
      }
    });
  }
  return result;
}

export function getHightLightDaysMap(
  highlightDates = [],
  defaultClassName = 'react-datepicker__day--highlighted',
) {
  const dateClasses = new Map();
  for (let i = 0, len = highlightDates.length; i < len; i++) {
    const obj = highlightDates[i];
    if (isDate(obj)) {
      const key = formatDate(obj, 'mm.dd.yyyy');
      const classNamesArr = dateClasses.get(key) || [];
      if (!classNamesArr.includes(defaultClassName)) {
        classNamesArr.push(defaultClassName);
        dateClasses.set(key, classNamesArr);
      }
    } else if (typeof obj === 'object') {
      const keys = Object.keys(obj);
      const className = keys[0];
      const arrOfMoments = obj[keys[0]];
      if (typeof className === 'string' && arrOfMoments.constructor === Array) {
        for (let k = 0, len = arrOfMoments.length; k < len; k++) {
          const key = formatDate(obj, 'mm.dd.yyyy');
          const classNamesArr = dateClasses.get(key) || [];
          if (!classNamesArr.includes(className)) {
            classNamesArr.push(className);
            dateClasses.set(key, classNamesArr);
          }
        }
      }
    }
  }

  return dateClasses;
}

export function timesToInjectAfter(
  startOfDay,
  currentTime,
  currentMultiplier,
  intervals,
  injectedTimes,
) {
  const l = injectedTimes.length;
  const times = [];
  for (let i = 0; i < l; i++) {
    const injectedTime = addMinutes(
      addHours(startOfDay, getHour(injectedTimes[i])),
      getMinute(injectedTimes[i]),
    );
    const nextTime = addMinutes(startOfDay, (currentMultiplier + 1) * intervals);

    if (injectedTime > currentTime.getTime() && injectedTime < nextTime.getTime()) {
      times.push(injectedTimes[i]);
    }
  }

  return times;
}

function getTimeToday(time) {
  let timeToday = new Date().setHours(time.getHours());
  timeToday.setMinutes(time.getMinutes());
  timeToday.setSeconds(time.getSeconds());
  return timeToday;
}
