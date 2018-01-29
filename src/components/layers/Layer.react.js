import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Checkbox from 'rc-checkbox';
import 'rc-checkbox/assets/index.css';

import Icon from '../../Icon';
import { cssColor } from '../map/styles';


class Layer extends React.Component {

  legendSymbol(geometryType, style) {
    if (style.type === 'icon') {
      return <Icon glyph={style.icon} style={{fill: cssColor(style.fill)}} />;
    }
    if (style.type === 'circle') {
      return (
        <svg className="icon" viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="20" style={{fill: cssColor(style.fill)}} />
        </svg>
      );
    }

    if (geometryType === 'line') {
      const lineStyle = {
        stroke: cssColor(style.stroke),
        strokeWidth: 4*(style.strokeWidth || 1)
      }
      return (
        <svg className="icon" viewBox="0 0 48 48">
          <line x1="2" y1="24" x2="46" y2="24" style={lineStyle} />
        </svg>
      );
    }
    if (geometryType === 'polygon') {
      const polygonStyle = {
        fill: cssColor(style.fill),
        stroke: cssColor(style.stroke),
        strokeWidth: 2*(style.strokeWidth || 1)
      }
      return (
        <svg className="icon" viewBox="0 0 48 48">
          <rect x="2" y="8" width="44" height="30" style={polygonStyle} />
        </svg>
      );
    }

    return <Icon glyph="donut" style={{fill: cssColor(style.fill)}} />;
  }

  legend() {
    const { datasetId, datasets, style } = this.props;
    const geometryType = datasets.get(datasetId).geometryType;

    if (Array.isArray(style)) {
      const symbols = style.map(s => this.legendSymbol(geometryType, s));
      return symbols.map((symbol, i) => (
        <div className="category-item" key={i}>
          { symbol } <span>{ style[i].label }</span>
        </div>
      ));
    }
    return this.legendSymbol(geometryType, style);
  }

  render() {
    const { id, title, visible, onChange, lang } = this.props;
    const legend = this.legend();
    const simpleLegend = !Array.isArray(legend);
    return (
      <div className="list-item">
        <div>
          <label className="list-item-checkbox">
            { (simpleLegend && legend) || <Icon glyph="arrow_down" className="icon more" /> }
            <Checkbox
              checked={visible}
              onChange={() => onChange(id, !visible)} />
            <span className="title">{title[lang]}</span>
          </label>
          { !simpleLegend && legend }
        </div>
      </div>
    );
  }
}

Layer.propTypes = {
  id: PropTypes.string,
  lang: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  visible: PropTypes.bool,
  datasetId: PropTypes.string,
  onChange: PropTypes.func,
}

export default connect(state => ({
  datasets: state.layers.datasets,
  lang: state.lang.selectedLanguage,
}), dispatch => bindActionCreators({
}, dispatch))(Layer);
