import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { setVisibleLayers } from '../layers/actions';
import { setZoom, setCenter } from '../view/actions';

class UrlState extends React.Component {

  parseHash() {
    const params = {};
    window.top.location.hash.substr(1).split('&').forEach(item => {
      const [key, value] = item.split('=');
      params[key] = value;
    });
    return params;
  }

  setHash(params) {
    const strings = Object.keys(params).map(key => `${key}=${params[key]}`)
    window.top.location.hash = strings.join('&')
  }

  componentDidMount() {
    const { setVisibleLayers, setZoom, setCenter } = this.props;
    const params = this.parseHash();

    if (params.x && params.y) {
      setCenter(parseFloat(params.x), parseFloat(params.y));
    }

    if (params.z) {
      setZoom(parseInt(params.z, 10));
    }

    // if (params.extent) {
    //   const extent = params.extent.split(',').map(v => parseFloat(v));
    //   setTimeout(() => {
    //     this.context.map.getView().fit(extent, {nearest: true});
    //   }, 20);
    // }

    if (params.layers) {
      setVisibleLayers(params.layers.split(','));
    }
  }

  componentDidUpdate(prevProps) {
    const { x, y, z, visibleLayers } = this.props;
    this.setHash({
      layers: visibleLayers.toList().toJS().join(','),
      // extent: this.context.map.getView().calculateExtent().map(v => Math.round(v)).join(','),
      x: Math.round(x),
      y: Math.round(y),
      z: Math.round(z)
    });
  }

  render() {
    return null;
  }
}

UrlState.contextTypes = {
  map: PropTypes.object
};

const visibleLayersSelector = createSelector(
  state => state.layers.layers,
  layers => layers.toList().filter(l => l.visible).map(l => l.id)
);

export default connect(state => ({
  x: state.view.x,
  y: state.view.y,
  z: state.view.z,
  visibleLayers: visibleLayersSelector(state)
}), dispatch => bindActionCreators({
  setVisibleLayers,
  setZoom,
  setCenter
}, dispatch))(UrlState);
