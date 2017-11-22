import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Checkbox from 'rc-checkbox';
import 'rc-checkbox/assets/index.css';

import Icon from '../../Icon';
import { setLayerVisibility } from './actions';
import { cssColor } from '../map/styles';


class Layer extends React.Component {

  toggleLayerVisibility() {
    const { id, name, visible, setLayerVisibility } = this.props;
    const [layerName, filter] = name.split(':');
    const olLayer = this.context.map.getLayers().getArray().find(l => l.get('name') === layerName);
    if (olLayer) {
      if (filter) {
        olLayer.setActive(filter, !visible);
      } else {
        olLayer.setVisible(!visible);
      }
    }
    setLayerVisibility(id, !visible);
  }

  render() {
    const { category, title, style, visible } = this.props;
    const legendStyle = {};
    if (style) {
      legendStyle.fill = cssColor(style.fill);
      legendStyle.stroke = cssColor(style.stroke);
    }
    return (
      <div className="list-item">
        <label className="list-item-checkbox">
          <Icon glyph={category.icon} style={legendStyle} />
          <Checkbox
            checked={visible}
            onChange={() => this.toggleLayerVisibility()} />
          <span className="title">{title}</span>
        </label>
      </div>
    );
  }
}

Layer.contextTypes = {
  map: PropTypes.object
};

export default connect(state => ({
  category: state.categories.categories.get(state.categories.activeId),
  layers: state.layers.layers.filter(l => l.catId === state.categories.activeId)
}), dispatch => bindActionCreators({
  setLayerVisibility
}, dispatch))(Layer);