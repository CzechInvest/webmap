import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import { openCategory, closeCategory } from './actions';
import Backdrop from '../ui/backdrop/Backdrop.react';
import Layers from '../layers/Layers.react';
import Icon from '../../Icon';


class Category extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      x: 0,
      y: 0,
      maxHeight: null
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
      let y = iconBounds.bottom + 20;

      // window.innerWidth doesn't work without 'user-scalable=no' in meta header
      const bodyBounds = document.body.getBoundingClientRect();
      const xOverflow = Math.max(0, x + this.popupEl.offsetWidth - bodyBounds.width);
      if (xOverflow > 1) {
        x -= xOverflow;
      }

      if (x !== this.state.x || y !== this.state.y) {
        this.setState({x, y, maxHeight: bodyBounds.height-y-8});
      }
    }
  }

  renderMenu(open) {
    const style = {
      left: this.state.x+'px',
      top: this.state.y+'px',
      maxHeight: this.state.maxHeight? (this.state.maxHeight+'px') : ''
    }
    return open && (
      <Backdrop zIndex="95" onClose={this.props.closeCategory}>
        <div
          className="popup-panel"
          style={style}
          ref={(el) => { this.setPopupEl(el) }}>
          <Layers />
        </div>
      </Backdrop>
    );
  }

  render() {
    const { id, title, icon, activeId, layers, openCategory, closeCategory, lang } = this.props;
    const open = id === activeId;
    const classes = classnames('category', {
      open: open,
      active: layers.find(l => l.catId === id && l.visible)
    });

    return (
      <div>
        <button
          title={title[lang]}
          className={classes}
          onClick={() => { open ? closeCategory() : openCategory(id)}}
        >
          <span className="title">{ title[lang] }</span>
          <div
            className="icon-box"
            ref={(el) => { this.setTargetEl(el) }}
          >
            <Icon glyph={icon} />
            <div className="shadow" />
          </div>
        </button>
        { this.renderMenu(open) }
      </div>
    );
  }
}

Category.propTypes = {
  activeId: PropTypes.string,
  layers: PropTypes.object,
  lang: PropTypes.string.isRequired,
  openCategory: PropTypes.func.isRequired,
  closeCategory: PropTypes.func.isRequired
}

export default connect( (state, props) => ({
  activeId: state.categories.activeId,
  layers: state.layers.layers,
  lang: state.lang.selectedLanguage,
}), dispatch => bindActionCreators({
  openCategory,
  closeCategory
}, dispatch))(Category);
