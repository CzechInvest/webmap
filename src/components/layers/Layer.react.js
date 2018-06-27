import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Checkbox from 'rc-checkbox';
import 'rc-checkbox/assets/index.css';

import Icon from '../../Icon';
import { cssColor } from '../map/styles';


function formatNumber(value) {
  return Intl.NumberFormat('cs-CZ', {style: 'decimal'}).format(value);
}

class Layer extends React.Component {

  legendSymbol(geometryType, style) {
    if (style.type === 'icon') {
      return <Icon glyph={style.icon} style={{fill: cssColor(style.fill)}} />;
    }
    if (geometryType === 'point') {
      const cssStyle = {
        fill: cssColor(style.fill || style.base.fill),
        stroke: cssColor(style.stroke || style.base.stroke),
        strokeWidth: 2*(style.strokeWidth || 1)
      }
      return (
        <svg className="icon" viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="20" style={cssStyle} />
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
  }

  legend() {
    const { datasetId, datasets, style } = this.props;
    const geometryType = datasets.get(datasetId).geometryType;

    if (Array.isArray(style)) {
      const symbols = style.map(s => this.legendSymbol(geometryType, s));
      return symbols.map((symbol, i) => (
        <div className="item" key={i}>
          { symbol } <span>{ style[i].label }</span>
        </div>
      ));
    }
    if (style.type === 'categorized') {
      const symbols = style.categories
        .filter(category => category.label || category.range)
        .map((category, i) => {
          const symbol = this.legendSymbol(geometryType, {...style.base, ...category});
          const label = category.label
            ? category.label
            : category.range
              ? category.range.map(formatNumber).join(' - ')
              : `${category.value}`;
          return <div className="item" key={i}> { symbol } <span>{ label }</span></div>
        });
      if (symbols.length) {
        return symbols;
      }
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
          { !simpleLegend && visible && <div className="legend-list">{legend}</div> }
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
