import React from 'react';
import ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Checkbox from 'rc-checkbox';
import 'rc-checkbox/assets/index.css';

import Icon from '../../Icon';
import { setLayerVisibility } from '../map/actions';
import './LayersList.scss';

function cssColor(color) {
  if (Array.isArray(color)) {
    return `rgba(${color.join(',')})`;
  }
  return color;
}

class LayersList extends React.Component {

  render() {
    const category = this.props.category;
    const layerItems = category.layers.map(layer => {
      const legendStyle = {};
      if (layer.style) {
        legendStyle.fill = cssColor(layer.style.fill);
        legendStyle.stroke = cssColor(layer.style.stroke);
      }
      return (
        <div className="list-item" key={layer.name}>
          <label className="list-item-checkbox">
            <Icon glyph={category.icon} style={legendStyle} />
            <Checkbox
              checked={layer.visible}
              onChange={() => this.props.setLayerVisibility(layer.name, !layer.visible)} />
            <span className="title">{layer.title}</span>
          </label>
        </div>
      );
    });
    return (
      <div
        className="layers-list">
        <h3>{category.title}</h3>
        {layerItems}
      </div>
    );
  }
}


export default connect(state => ({

}), dispatch => bindActionCreators({
  setLayerVisibility
}, dispatch))(LayersList);