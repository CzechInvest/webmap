import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Map from 'ol/map';
import './Map.scss';
import VectorLayer from 'ol/layer/vector';
import VectorSource from 'ol/source/vector';
import Cluster from 'ol/source/cluster';
import GeoJSON from 'ol/format/geojson';

import { createLayerStyle } from './styles';
import FilteredPointLayer from './layers';
import Geobuf from './formats';


class MapComponent extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
  }

  constructor() {
    super();
    this.map = new Map();
  }

  createLayers() {

    this.props.layers.forEach(l => {
    const layer = l.toJS();

      if (layer.source) { // temporary check until all layers will be properly configured
        let vectorLayer;
        let source = new VectorSource({
          url: layer.source,
          format: layer.source.endsWith('.pbf')? Geobuf() : new GeoJSON(),
          style: createLayerStyle(layer)
        });

        if (layer.filter) {
          vectorLayer = FilteredPointLayer({
            source: source,
            label: layer.style.label
          });
        } else {
          vectorLayer = new VectorLayer({
            source: layer.type === 'point' ? new Cluster({source}) : source,
            visible: layer.visible,
            style: createLayerStyle(layer)
          });
        }
        vectorLayer.set('name', layer.name.split(':')[0]);
        this.map.addLayer(vectorLayer);
      }

      if (layer.filter) {
        const [layername, filtername] = layer.name.split(':');
        const olLayer = this.map.getLayers().getArray().find(l => l.get('name') === layername);
        olLayer.setActive(filtername, layer.visible);
        olLayer.addFilter({
          name: filtername,
          filter: feature => {
            return feature.get(layer.filter.attribute).indexOf(layer.filter.value) !== -1;
          },
          color: layer.style.fill
        })
      }
    });
  }

  getChildContext() {
    return { map: this.map };
  }

  shouldComponentUpdate() {
    return false;
  }

  componentDidMount() {
    this.createLayers();
    this.map.setTarget(this.mapEl);
    window.map = this.map;
  }

  render() {
    return (
      <div
        id="map"
        ref={node => {this.mapEl = node} }
      >
        { this.props.children }
      </div>
    );
  }
}

MapComponent.childContextTypes = {
  map: PropTypes.instanceOf(Map)
};


export default connect(state => ({
  title: state.app.title,
  layers: state.layers.layers
}), dispatch => bindActionCreators({
}, dispatch))(MapComponent);
