import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {
  getDate,
  getDay,
  getDayOfWeekCode,
  getMonth,
  isDayDisabled,
  isDayInRange,
  isSameDay,
  now,
} from './date_utils';

const PREFIX_CLASSNAME = 'react-datepicker__day';

export default class Day extends React.Component {
  handleClick = event => {
    if (!this.isDisabled() && this.props.onClick) {
      this.props.onClick(event);
    }
  };

  handleMouseEnter = event => {
    if (!this.isDisabled() && this.props.onMouseEnter) {
      this.props.onMouseEnter(event);
    }
  };

  isSameDay = other => isSameDay(this.props.day, other);

  isKeyboardSelected = () =>
    !this.props.inline &&
    !this.isSameDay(this.props.selected) &&
    this.isSameDay(this.props.preSelection);

  isDisabled = () => isDayDisabled(this.props.day, this.props);

  getHighLightedClass = defaultClassName => {
    const { day, highlightDates } = this.props;

    if (!highlightDates) {
      return false;
    }

    // Looking for className in the Map of {'day string, 'className'}
    const dayStr = day.format('MM.DD.YYYY');
    return highlightDates.get(dayStr);
  };

  isInRange = () => {
    const { day, startDate, endDate } = this.props;
    if (!startDate || !endDate) {
      return false;
    }
    return isDayInRange(day, startDate, endDate);
  };

  isInSelectingRange = () => {
    const {
      day,
      selectsStart,
      selectsEnd,
      selectingDate,
      startDate,
      endDate
    } = this.props;

    if (!(selectsStart || selectsEnd) || !selectingDate || this.isDisabled()) {
      return false;
    }

    if (selectsStart && endDate && selectingDate.isSameOrBefore(endDate)) {
      return isDayInRange(day, selectingDate, endDate);
    }

    if (selectsEnd && startDate && selectingDate.isSameOrAfter(startDate)) {
      return isDayInRange(day, startDate, selectingDate);
    }

    return false;
  };

  isSelectingRangeStart = () => {
    if (!this.isInSelectingRange()) {
      return false;
    }

    const { day, selectingDate, startDate, selectsStart } = this.props;

    if (selectsStart) {
      return isSameDay(day, selectingDate);
    } else {
      return isSameDay(day, startDate);
    }
  };

  isSelectingRangeEnd = () => {
    if (!this.isInSelectingRange()) {
      return false;
    }

    const { day, selectingDate, endDate, selectsEnd } = this.props;

    if (selectsEnd) {
      return isSameDay(day, selectingDate);
    } else {
      return isSameDay(day, endDate);
    }
  };

  isRangeStart = () => {
    const { day, startDate, endDate } = this.props;
    if (!startDate || !endDate) {
      return false;
    }
    return isSameDay(startDate, day);
  };

  isRangeEnd = () => {
    const { day, startDate, endDate } = this.props;
    if (!startDate || !endDate) {
      return false;
    }
    return isSameDay(endDate, day);
  };

  isWeekend = () => {
    const weekday = getDay(this.props.day);
    return weekday === 0 || weekday === 6;
  };

  isOutsideMonth = () => {
    return (
      this.props.month !== undefined &&
      this.props.month !== getMonth(this.props.day)
    );
  };

  getClassNames = date => {
    const dayClassName = this.props.dayClassName
      ? this.props.dayClassName(date)
      : undefined;
    return classnames(
      PREFIX_CLASSNAME,
      dayClassName,
      `${PREFIX_CLASSNAME}--${getDayOfWeekCode(this.props.day)}`,
      {
        [`${PREFIX_CLASSNAME}--disabled`]: this.isDisabled(),
        [`${PREFIX_CLASSNAME}--selected`]: this.isSameDay(this.props.selected),
        [`${PREFIX_CLASSNAME}--keyboard-selected`]: this.isKeyboardSelected(),
        [`${PREFIX_CLASSNAME}--range-start`]: this.isRangeStart(),
        [`${PREFIX_CLASSNAME}--range-end`]: this.isRangeEnd(),
        [`${PREFIX_CLASSNAME}--in-range`]: this.isInRange(),
        [`${PREFIX_CLASSNAME}--in-selecting-range`]: this.isInSelectingRange(),
        [`${PREFIX_CLASSNAME}--selecting-range-start`]: this.isSelectingRangeStart(),
        [`${PREFIX_CLASSNAME}--selecting-range-end`]: this.isSelectingRangeEnd(),
        [`${PREFIX_CLASSNAME}--today`]: this.isSameDay(
          now(this.props.utcOffset)
        ),
        [`${PREFIX_CLASSNAME}--weekend`]: this.isWeekend(),
        [`${PREFIX_CLASSNAME}--outside-month`]: this.isOutsideMonth()
      },
      this.getHighLightedClass(`${PREFIX_CLASSNAME}--highlighted`)
    );
  };

  render() {
    return (
      <div
        className={this.getClassNames(this.props.day)}
        onClick={this.handleClick}
        onMouseEnter={this.handleMouseEnter}
        aria-label={`day-${getDate(this.props.day)}`}
        role="option"
        aria-selected={false}
      >
        {getDate(this.props.day)}
      </div>
    );
  }
}

Day.propTypes = {
  day: PropTypes.object.isRequired,
  dayClassName: PropTypes.func,
  endDate: PropTypes.object,
  highlightDates: PropTypes.instanceOf(Map),
  inline: PropTypes.bool,
  month: PropTypes.number,
  onClick: PropTypes.func,
  onMouseEnter: PropTypes.func,
  preSelection: PropTypes.object,
  selected: PropTypes.object,
  selectingDate: PropTypes.object,
  selectsEnd: PropTypes.bool,
  selectsStart: PropTypes.bool,
  startDate: PropTypes.object,
  utcOffset: PropTypes.number
};
