import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * Component that listen event of clicking outside of it.
 *
 * @export
 * @class OutsideClick
 * @extends {Component}
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
   *
   * @param {object} node
   * @memberof OutsideClick
   */
  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  /**
   * Handle event if clicked outside of element
   *
   * @param {object} event
   * @memberof OutsideClick
   */
  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
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