import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classnames from 'classnames';

import Icon from '../../Icon';
import LayersList from './LayersList.react'
import Backdrop from './Backdrop.react'
import './Menu.scss';


class CategoryLayersMenu extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      activeItem: null,
      activeIndex: -1,
      style: {}
    };
  }

  open(category, target) {

    var triggerBounds = target.getBoundingClientRect();
    const style = {
      position: 'absolute',
      left: triggerBounds.left+'px',
      top: (triggerBounds.bottom+5)+'px'
    };
    this.setState({
      activeItem: category,
      activeIndex: this.props.categories.indexOf(category),
      style
    });
  }

  close() {
    this.setState({
      activeItem: null,
      activeIndex: -1
    });
  }


  renderItem(category, index) {
    let targetEl;
    const classes = classnames('category', {active: this.state.activeIndex === index});
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

        {this.state.activeItem &&
        <Backdrop onClose={() => this.close()}>
          <div className="panel" style={this.state.style}>
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
}, dispatch))(CategoryLayersMenu);