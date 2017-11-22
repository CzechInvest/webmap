import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Layer from './Layer.react';
import './Layers.scss';


class Layers extends React.Component {
  static propTypes = {
    category: PropTypes.object,
    layers: PropTypes.object,
  }

  render() {
    const { category, layers } = this.props;
    return (
      <div
        className="layers-list">
        <h3>{category.title}</h3>
        {layers.toList().map(l => <Layer key={l.id} {...l.toJS()} />)}
      </div>
    )
  }
}

export default connect(state => ({
  category: state.categories.categories.get(state.categories.activeId),
  layers: state.layers.layers.filter(l => l.catId === state.categories.activeId)
}), dispatch => bindActionCreators({
}, dispatch))(Layers);