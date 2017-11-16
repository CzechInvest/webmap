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

import createLayerStyle from './styles';
import FilteredPointLayers from './layers';
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
    this.props.categories.forEach(category => {
      category.layers.forEach(layer => {
        if (layer.source) { // temporary check until all layers will be properly configured
          let vectorLayer;
          let source = new VectorSource({
            url: layer.source,
            format: layer.source.endsWith('.pbf')? Geobuf() : new GeoJSON()
          });

          if (layer.filter) {
            vectorLayer = FilteredPointLayers({
              source: source
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
          const olLayer = this.map.getLayers().getArray().find((l) => {
            return l.get('name') === layername;
          });
          olLayer.setActive(filtername, layer.visible);
          olLayer.addFilter({
            name: filtername,
            filter: feature => {
              return feature.get(layer.filter.attribute).indexOf(layer.filter.value) !== -1;
            },
            style: createLayerStyle(layer)
          })
        }
      });
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
        ref={node => {this.mapEl = node;} }
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
  categories: state.map.categories
}), dispatch => bindActionCreators({
}, dispatch))(MapComponent);
