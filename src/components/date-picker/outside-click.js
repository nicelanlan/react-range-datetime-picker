import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * Component that alerts if you click outside of it
 */
export default class OutsideClick extends Component {
  constructor(props) {
    super(props);

    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  /**
   * Set the wrapper ref
   */
  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  /**
   * Alert if clicked on outside of element
   */
  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      // alert('You clicked outside of me!');
      this.props.onClickOutside && this.props.onClickOutside();
    }
  }

  render() {
    return <div className="react-datepicker-wrapper" ref={this.setWrapperRef}>{this.props.children}</div>;
  }
}

OutsideClick.propTypes = {
  children: PropTypes.element.isRequired,
  onClickOutside: PropTypes.func,
};