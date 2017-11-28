import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Checkbox from 'rc-checkbox';
import 'rc-checkbox/assets/index.css';

import Icon from '../../Icon';
import { setLayerVisibility } from './actions';
import { cssColor } from '../map/styles';


class Layer extends React.Component {

  render() {
    const { category, id, title, style, visible, setLayerVisibility } = this.props;
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
            onChange={() => setLayerVisibility(id, !visible)} />
          <span className="title">{title}</span>
        </label>
      </div>
    );
  }
}

export default connect(state => ({
  category: state.categories.categories.get(state.categories.activeId)
}), dispatch => bindActionCreators({
  setLayerVisibility
}, dispatch))(Layer);
