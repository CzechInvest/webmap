import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { openCategory, closeCategory } from './actions';
import Backdrop from '../backdrop/Backdrop.react';
import Layers from '../layers/Layers.react';

import Icon from '../../Icon';


class Category extends React.Component {
  static propTypes = {
    activeId: PropTypes.number,
    layers: PropTypes.object,
    openCategory: PropTypes.func.isRequired,
    closeCategory: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      x: 0,
      y: 0
    };
  }

  setTargetEl(el) {
    this.targetEl = el;
    this.updatePosition();
  }

  setPopupEl(el) {
    this.popupEl = el;
    this.updatePosition();
  }

  updatePosition() {
    if (this.targetEl && this.popupEl) {
      const iconBounds = this.targetEl.getBoundingClientRect();
      let x = iconBounds.left;
      let y = iconBounds.bottom + 10;

      // window.innerWidth doesn't work without 'user-scalable=no' in meta header
      const maxWidth = document.body.getBoundingClientRect().width;
      const xOverflow = Math.max(0, x + this.popupEl.offsetWidth - maxWidth);
      if (xOverflow > 1) {
        x -= xOverflow;
      }

      if (x !== this.state.x || y !== this.state.y) {
        this.setState({x, y});
      }
    }
  }

  render() {
    const { id, title, icon, activeId, layers, openCategory, closeCategory } = this.props;
    const open = id === activeId;
    const classes = classnames('category', {
      open: open,
      active: layers.find(l => l.catId === id && l.visible)
    });

    const style = {
      left: this.state.x+'px',
      top: this.state.y+'px'
    }
    return (
      <div>
        <button
          className={classes}
          onClick={() => { open ? closeCategory() : openCategory(id)}}
        >
          <span className="title">{ title }</span>
          <div
            className="icon-box"
            ref={(el) => { this.setTargetEl(el) }}
          >
            <Icon glyph={icon} />
          </div>
        </button>
        { open &&
          <Backdrop onClose={closeCategory}>
            <div
              className="popup-panel"
              style={style}
              ref={(el) => { this.setPopupEl(el) }}>
              <Layers />
            </div>
          </Backdrop>
        }
      </div>
    );
  }
}

export default connect(state => ({
  activeId: state.categories.activeId,
  layers: state.layers.layers
}), dispatch => bindActionCreators({
  openCategory,
  closeCategory
}, dispatch))(Category);
