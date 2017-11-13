import React from 'react';
import ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Checkbox from 'rc-checkbox';
import 'rc-checkbox/assets/index.css';

import Icon from '../../Icon';
import { setLayerVisibility } from '../map/actions';
import './LayersList.scss';


class LayersList extends React.Component {

  render() {
    const category = this.props.category;
    const layerItems = category.layers.map(layer => {
      return (
        <label className="list-item" key={layer.name}>
          <Icon glyph={category.icon} />
          <Checkbox
            checked={layer.visible}
            onChange={() => this.props.setLayerVisibility(layer.name, !layer.visible)} />
          <span>{layer.title}</span>
        </label>
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