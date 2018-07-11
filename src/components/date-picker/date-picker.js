import Calendar from './calendar';
import OutsideClick from './outside-click';
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {
  newDate,
  now,
  cloneDate,
  isMoment,
  isDate,
  isBefore,
  isAfter,
  equals,
  setTime,
  getSecond,
  getMinute,
  getHour,
  addDays,
  addMonths,
  addWeeks,
  addYears,
  subtractDays,
  subtractMonths,
  subtractWeeks,
  subtractYears,
  isSameDay,
  isDayDisabled,
  isDayInRange,
  getEffectiveMinDate,
  getEffectiveMaxDate,
  parseDate,
  safeDateFormat,
  getHightLightDaysMap,
  getYear,
  getMonth
} from './date-utils';

const PREFIX_CLASSNAME = 'react-datepicker';

const PRESELECT_CHANGE_VIA_INPUT = 'input';
const PRESELECT_CHANGE_VIA_NAVIGATE = 'navigate';

// Compares dates year+month combinations
function hasPreSelectionChanged(date1, date2) {
  if (date1 && date2) {
    return (
      getMonth(date1) !== getMonth(date2) || getYear(date1) !== getYear(date2)
    );
  }

  return date1 !== date2;
}

function hasSelectionChanged(date1, date2) {
  if (date1 && date2) {
    return !equals(date1, date2);
  }

  return false;
}

/**
 * General datepicker component.
 */

export default class DatePicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.calcInitialState();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.inline &&
      hasPreSelectionChanged(prevProps.selected, this.props.selected)
    ) {
      this.setPreSelection(this.props.selected);
    }
    if (prevProps.highlightDates !== this.props.highlightDates) {
      this.setState({
        highlightDates: getHightLightDaysMap(this.props.highlightDates)
      });
    }
    if (
      !prevState.focused &&
      hasSelectionChanged(prevProps.selected, this.props.selected)
    ) {
      this.setState({ inputValue: null });
    }
  }

  componentWillUnmount() {
    this.clearPreventFocusTimeout();
  }

  getPreSelection = () =>
    this.props.openToDate
      ? newDate(this.props.openToDate)
      : this.props.selectsEnd && this.props.startDate
        ? newDate(this.props.startDate)
        : this.props.selectsStart && this.props.endDate
          ? newDate(this.props.endDate)
          : now(this.props.utcOffset);

  calcInitialState = () => {
    const defaultPreSelection = this.getPreSelection();
    const minDate = getEffectiveMinDate(this.props);
    const maxDate = getEffectiveMaxDate(this.props);
    const boundedPreSelection =
      minDate && isBefore(defaultPreSelection, minDate)
        ? minDate
        : maxDate && isAfter(defaultPreSelection, maxDate)
          ? maxDate
          : defaultPreSelection;
    return {
      open: this.props.startOpen || false,
      preventFocus: false,
      preSelection: this.props.selected
        ? newDate(this.props.selected)
        : boundedPreSelection,
      // transforming highlighted days (perhaps nested array)
      // to flat Map for faster access in day.jsx
      highlightDates: getHightLightDaysMap(this.props.highlightDates),
      focused: false
    };
  };

  clearPreventFocusTimeout = () => {
    if (this.preventFocusTimeout) {
      clearTimeout(this.preventFocusTimeout);
    }
  };

  setFocus = () => {
    if (this.input && this.input.focus) {
      this.input.focus();
    }
  };

  setOpen = open => {
    this.setState({
      open: open,
      preSelection:
        open && this.state.open
          ? this.state.preSelection
          : this.calcInitialState().preSelection,
      lastPreSelectChange: PRESELECT_CHANGE_VIA_NAVIGATE
    });
  };

  handleFocus = event => {
    if (!this.state.preventFocus) {
      this.props.onFocus(event);
      if (!this.props.preventOpenOnFocus) {
        this.setOpen(true);
      }
    }
    this.setState({ focused: true });
  };

  cancelFocusInput = () => {
    clearTimeout(this.inputFocusTimeout);
    this.inputFocusTimeout = null;
  };

  deferFocusInput = () => {
    this.cancelFocusInput();
    this.inputFocusTimeout = setTimeout(() => this.setFocus(), 1);
  };

  handleBlur = event => {
    if (this.state.open) {
      this.deferFocusInput();
    } else {
      this.props.onBlur(event);
    }
    this.setState({ focused: false });
  };

  handleClickOutside = event => {
    if (!this.props.inline) {
      this.setOpen(false);
    }
    this.props.onClickOutside && this.props.onClickOutside();
  };

  handleChange = (...allArgs) => {
    let event = allArgs[0];
    if (this.props.onChangeRaw) {
      this.props.onChangeRaw.apply(this, allArgs);
      if (
        typeof event.isDefaultPrevented !== 'function' ||
        event.isDefaultPrevented()
      ) {
        return;
      }
    }
    this.setState({
      inputValue: event.target.value,
      lastPreSelectChange: PRESELECT_CHANGE_VIA_INPUT
    });
    const date = parseDate(event.target.value, this.props);
    if (date || !event.target.value) {
      this.setSelected(date, event, true);
    }
  };

  handleSelect = (date, event) => {
    // Preventing onFocus event to fix issue
    // https://github.com/Hacker0x01/react-datepicker/issues/628
    this.setState({ preventFocus: true }, () => {
      this.preventFocusTimeout = setTimeout(
        () => this.setState({ preventFocus: false }),
        50
      );
      return this.preventFocusTimeout;
    });
    this.setSelected(date, event);
    if (!this.props.shouldCloseOnSelect || this.props.showTimeSelect) {
      this.setPreSelection(date);
    } else if (!this.props.inline) {
      this.setOpen(false);
    }
  };

  setSelected = (date, event, keepInput) => {
    let changedDate = date;

    if (changedDate !== null && isDayDisabled(changedDate, this.props)) {
      return;
    }

    if (
      !isSameDay(this.props.selected, changedDate) ||
      this.props.allowSameDay
    ) {
      if (changedDate !== null) {
        if (this.props.selected) {
          let selected = this.props.selected;
          if (keepInput) selected = newDate(changedDate);
          changedDate = setTime(newDate(changedDate), {
            hour: getHour(selected),
            minute: getMinute(selected),
            second: getSecond(selected)
          });
        }
        if (!this.props.inline) {
          this.setState({
            preSelection: changedDate
          });
        }
      }
      this.props.onChange(changedDate, event);
    }

    this.props.onSelect(changedDate, event);

    if (!keepInput) {
      this.setState({ inputValue: null });
    }
  };

  setPreSelection = date => {
    const isDateRangePresent =
      typeof this.props.minDate !== 'undefined' &&
      typeof this.props.maxDate !== 'undefined';
    const isValidDateSelection =
      isDateRangePresent && date
        ? isDayInRange(date, this.props.minDate, this.props.maxDate)
        : true;
    if (isValidDateSelection) {
      this.setState({
        preSelection: date
      });
    }
  };

  handleTimeChange = time => {
    const selected = this.props.selected
      ? this.props.selected
      : this.getPreSelection();
    let changedDate = setTime(cloneDate(selected), {
      hour: getHour(time),
      minute: getMinute(time)
    });

    this.setState({
      preSelection: changedDate
    });

    this.props.onChange(changedDate);
    this.setOpen(false);
    this.setState({ inputValue: null });
    this.props.afterSelected && this.props.afterSelected();
  };

  onInputClick = event => {
    if (!this.props.disabled) {
      this.setOpen(true);
    }
  };

  onInputKeyDown = event => {
    this.props.onKeyDown(event);
    const eventKey = event.key;
    if (
      !this.state.open &&
      !this.props.inline &&
      !this.props.preventOpenOnFocus
    ) {
      if (eventKey === 'ArrowDown' || eventKey === 'ArrowUp') {
        this.onInputClick();
      }
      return;
    }
    const copy = newDate(this.state.preSelection);
    if (eventKey === 'Enter') {
      event.preventDefault();
      if (
        (isMoment(this.state.preSelection) ||
          isDate(this.state.preSelection)) &&
        this.state.lastPreSelectChange === PRESELECT_CHANGE_VIA_NAVIGATE
      ) {
        this.handleSelect(copy, event);
        !this.props.shouldCloseOnSelect && this.setPreSelection(copy);
      } else {
        this.setOpen(false);
      }
    } else if (eventKey === 'Escape') {
      event.preventDefault();
      this.setOpen(false);
    } else if (eventKey === 'Tab') {
      this.setOpen(false);
    } else if (!this.props.disabledKeyboardNavigation) {
      let newSelection;
      switch (eventKey) {
        case 'ArrowLeft':
          newSelection = subtractDays(copy, 1);
          break;
        case 'ArrowRight':
          newSelection = addDays(copy, 1);
          break;
        case 'ArrowUp':
          newSelection = subtractWeeks(copy, 1);
          break;
        case 'ArrowDown':
          newSelection = addWeeks(copy, 1);
          break;
        case 'PageUp':
          newSelection = subtractMonths(copy, 1);
          break;
        case 'PageDown':
          newSelection = addMonths(copy, 1);
          break;
        case 'Home':
          newSelection = subtractYears(copy, 1);
          break;
        case 'End':
          newSelection = addYears(copy, 1);
          break;
        default:
          break;
      }
      if (!newSelection) return; // Let the input component handle this keydown
      event.preventDefault();
      this.setState({ lastPreSelectChange: PRESELECT_CHANGE_VIA_NAVIGATE });
      if (this.props.adjustDateOnChange) {
        this.setSelected(newSelection);
      }
      this.setPreSelection(newSelection);
    }
  };

  onClearClick = event => {
    if (event) {
      if (event.preventDefault) {
        event.preventDefault();
      }
    }
    this.props.onChange(null, event);
    this.setState({ inputValue: null });
  };

  clear = () => {
    this.onClearClick();
  };

  renderCalendar = () => {
    if (!this.props.inline && ((!this.state.open && !this.props.startOpen) || this.props.disabled)) {
      return null;
    }
    return (
      <Calendar
        ref={elem => {
          this.calendar = elem;
        }}
        locale={this.props.locale}
        adjustDateOnChange={this.props.adjustDateOnChange}
        setOpen={this.setOpen}
        dateFormat={this.props.dateFormatCalendar}
        useWeekdaysShort={this.props.useWeekdaysShort}
        formatWeekDay={this.props.formatWeekDay}
        selected={this.props.selected}
        preSelection={this.state.preSelection}
        onSelect={this.handleSelect}
        onWeekSelect={this.props.onWeekSelect}
        openToDate={this.props.openToDate}
        minDate={this.props.minDate}
        maxDate={this.props.maxDate}
        selectsStart={this.props.selectsStart}
        selectsEnd={this.props.selectsEnd}
        startDate={this.props.startDate}
        endDate={this.props.endDate}
        excludeDates={this.props.excludeDates}
        formatWeekNumber={this.props.formatWeekNumber}
        highlightDates={this.state.highlightDates}
        includeDates={this.props.includeDates}
        includeTimes={this.props.includeTimes}
        injectTimes={this.props.injectTimes}
        inline={this.props.inline}
        peekNextMonth={this.props.peekNextMonth}
        forceShowMonthNavigation={this.props.forceShowMonthNavigation}
        showDisabledMonthNavigation={this.props.showDisabledMonthNavigation}
        weekLabel={this.props.weekLabel}
        utcOffset={this.props.utcOffset}
        fixedHeight={this.props.fixedHeight}
        monthsShown={this.props.monthsShown}
        onMonthChange={this.props.onMonthChange}
        onYearChange={this.props.onYearChange}
        dayClassName={this.props.dayClassName}
        showTimeSelect={this.props.showTimeSelect}
        onTimeChange={this.handleTimeChange}
        timeFormat={this.props.timeFormat}
        timeIntervals={this.props.timeIntervals}
        minTime={this.props.minTime}
        maxTime={this.props.maxTime}
        excludeTimes={this.props.excludeTimes}
        timeCaption={this.props.timeCaption}
        className={this.props.calendarClassName}
        container={this.props.calendarContainer}
      >
        {this.props.children}
      </Calendar>
    );
  };

  renderDateInput = () => {
    const className = classnames('react-datepicker-input', {'react-datepicker-input-range': this.props.selectsStart || this.props.selectsEnd});
    const customInput = this.props.customInput || <input type="text" />;
    const customInputRef = this.props.customInputRef || 'ref';
    const inputValue =
      typeof this.props.value === 'string'
        ? this.props.value
        : typeof this.state.inputValue === 'string'
          ? this.state.inputValue
          : safeDateFormat(this.props.selected, this.props);

    return React.cloneElement(customInput, {
      [customInputRef]: input => {
        this.input = input;
      },
      value: inputValue,
      onBlur: this.handleBlur,
      onChange: this.handleChange,
      onClick: this.onInputClick,
      onFocus: this.handleFocus,
      onKeyDown: this.onInputKeyDown,
      id: this.props.id,
      name: this.props.name,
      autoFocus: this.props.autoFocus,
      placeholder: this.props.placeholderText,
      disabled: this.props.disabled,
      autoComplete: this.props.autoComplete,
      className: className,
      title: this.props.title,
      readOnly: this.props.readOnly,
      required: this.props.required,
      tabIndex: this.props.tabIndex
    });
  };

  renderClearButton = () => {
    if (this.props.isClearable && this.props.selected != null) {
      return (
        <button
          type="button"
          className={`${PREFIX_CLASSNAME}__close-icon`}
          onClick={this.onClearClick}
          title={this.props.clearButtonTitle}
          tabIndex={-1}
         
        />
      );
    } else {
      return null;
    }
  };


  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };
  render() {
    const calendar = this.renderCalendar();

    if (this.props.inline) {
      return calendar;
    }

    const classes = classnames('react-datepicker-popper', this.props.popperClassName);
    const display = (this.state.open && !this.props.disabled) || this.props.startOpen ? 'block' : 'none';
    return (
      <OutsideClick onClickOutside={this.handleClickOutside}>
        <div className="react-datepicker-wrapper">
          <div className={`${PREFIX_CLASSNAME}__input-container`}>
            {this.renderDateInput()}
            {this.renderClearButton()}
          </div>
          <div className={classes} style={{display}}>
            {calendar}
          </div>
        </div>
      </OutsideClick>
    );
  }
}

DatePicker.propTypes = {
  adjustDateOnChange: PropTypes.bool,
  allowSameDay: PropTypes.bool,
  autoComplete: PropTypes.string,
  autoFocus: PropTypes.bool,
  calendarClassName: PropTypes.string,
  calendarContainer: PropTypes.func,
  children: PropTypes.node,
  className: PropTypes.string,
  customInput: PropTypes.element,
  customInputRef: PropTypes.string,
  // eslint-disable-next-line react/no-unused-prop-types
  dateFormat: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  dateFormatCalendar: PropTypes.string,
  dayClassName: PropTypes.func,
  disabled: PropTypes.bool,
  disabledKeyboardNavigation: PropTypes.bool,
  endDate: PropTypes.object,
  excludeDates: PropTypes.array,
  fixedHeight: PropTypes.bool,
  formatWeekNumber: PropTypes.func,
  highlightDates: PropTypes.array,
  id: PropTypes.string,
  includeDates: PropTypes.array,
  includeTimes: PropTypes.array,
  injectTimes: PropTypes.array,
  inline: PropTypes.bool,
  isClearable: PropTypes.bool,
  locale: PropTypes.string,
  maxDate: PropTypes.object,
  minDate: PropTypes.object,
  monthsShown: PropTypes.number,
  name: PropTypes.string,
  onBlur: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  onSelect: PropTypes.func,
  onWeekSelect: PropTypes.func,
  onClickOutside: PropTypes.func,
  onChangeRaw: PropTypes.func,
  onFocus: PropTypes.func,
  onKeyDown: PropTypes.func,
  onMonthChange: PropTypes.func,
  onYearChange: PropTypes.func,
  openToDate: PropTypes.object,
  peekNextMonth: PropTypes.bool,
  placeholderText: PropTypes.string,
  preventOpenOnFocus: PropTypes.bool,
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
  selected: PropTypes.object,
  selectsEnd: PropTypes.bool,
  selectsStart: PropTypes.bool,
  forceShowMonthNavigation: PropTypes.bool,
  showDisabledMonthNavigation: PropTypes.bool,
  startDate: PropTypes.object,
  startOpen: PropTypes.bool,
  tabIndex: PropTypes.number,
  timeCaption: PropTypes.string,
  title: PropTypes.string,
  useWeekdaysShort: PropTypes.bool,
  formatWeekDay: PropTypes.func,
  utcOffset: PropTypes.number,
  value: PropTypes.string,
  weekLabel: PropTypes.string,
  shouldCloseOnSelect: PropTypes.bool,
  showTimeSelect: PropTypes.bool,
  timeFormat: PropTypes.string,
  timeIntervals: PropTypes.number,
  minTime: PropTypes.object,
  maxTime: PropTypes.object,
  excludeTimes: PropTypes.array,
  clearButtonTitle: PropTypes.string
};

DatePicker.defaultProps = {
  allowSameDay: false,
  dateFormat: 'L',
  dateFormatCalendar: 'mm yyyy',
  onChange() {},
  disabled: false,
  disabledKeyboardNavigation: false,
  onFocus() {},
  onBlur() {},
  onKeyDown() {},
  onSelect() {},
  onClickOutside() {},
  onMonthChange() {},
  preventOpenOnFocus: false,
  onYearChange() {},
  monthsShown: 1,
  shouldCloseOnSelect: true,
  showTimeSelect: false,
  timeIntervals: 30,
  timeCaption: 'Time'
};
