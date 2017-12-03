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

  render() {
    const { category, id, title, style, visible, setLayerVisibility, lang } = this.props;
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
          <span className="title">{title[lang]}</span>
        </label>
      </div>
    );
  }
}

Layer.propTypes = {
  category: PropTypes.object,
  id: PropTypes.string,
  lang: PropTypes.string,
  style: PropTypes.object,
  visible: PropTypes.bool,
  setLayerVisibility: PropTypes.func.isRequired,
}

export default connect(state => ({
  category: state.categories.categories.get(state.categories.activeId),
  lang: state.lang.selectedLanguage,
}), dispatch => bindActionCreators({
  setLayerVisibility
}, dispatch))(Layer);
