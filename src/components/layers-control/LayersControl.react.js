import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classnames from 'classnames';

import Icon from '../../Icon';
import LayersList from './LayersList.react'
import Backdrop from './Backdrop.react'
import './Menu.scss';


class LayersControl extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      activeItem: null,
      activeIndex: -1,
      style: {}
    };
  }

  open(category, target) {
    console.log('open')
    const triggerBounds = target.getBoundingClientRect();
    const style = {
      position: 'absolute',
      left: Math.max(0, triggerBounds.left)+'px',
      top: (triggerBounds.bottom+5)+'px'
    };
    this.setState({
      activeItem: category,
      activeIndex: this.props.categories.indexOf(category),
      style
    });
  }

  componentDidUpdate() {
    console.log('componentDidUpdate');
    if (this.popupEl) {
      const left = parseInt(this.state.style.left);
      var xOverflow = Math.max(0, left + this.popupEl.offsetWidth - window.innerWidth);
      if (xOverflow > 1) {
        const newStyle = Object.assign({}, this.state.style);
        newStyle.left = (left - xOverflow)+'px';
        this.setState({
          style: newStyle
        });
      }
    }
  }

  close() {
    this.setState({
      activeItem: null,
      activeIndex: -1
    });
  }


  renderItem(category, index) {
    let targetEl;
    const classes = classnames('category', {
      open: this.state.activeIndex === index,
      active: Boolean(category.layers.find((l) => {return l.visible}))
    });
    return (
      <button
        key={category.title}
        className={classes}
        onClick={(e) => this.open(category, targetEl)}>
        <span className="title">{ category.title }</span>
        <div
          ref={(el) => { targetEl = el }}
          className="icon-box">
          <Icon glyph={category.icon} />
        </div>
      </button>
    );
  }

  render() {
    return (
      <div className="layers-menu">
        {this.props.categories.map(this.renderItem.bind(this))}
        <span>&nbsp;</span>

        {this.state.activeItem &&
        <Backdrop onClose={() => this.close()}>
          <div
            className="panel"
            style={this.state.style}
            ref={(el) => { this.popupEl = el }}>
            <LayersList
              category={this.props.categories[this.state.activeIndex]}
              activeIndex={this.state.activeIndex} />
          </div>
        </Backdrop>}
      </div>
    )
  }
}

export default connect(state => ({
  categories: state.map.categories
}), dispatch => bindActionCreators({
}, dispatch))(LayersControl);