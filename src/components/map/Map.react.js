import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
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

    this.map.layerById = {};
    this.props.layers.forEach(l => {
    const layer = l.toJS();

      if (layer.source) { // temporary check until all layers will be properly configured
        let vectorLayer;
        let source = new VectorSource({
          url: layer.source,
          format: layer.source.endsWith('.pbf')? Geobuf() : new GeoJSON()
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
        vectorLayer.set('id', layer.id.split(':')[0]);
        this.map.addLayer(vectorLayer);
        this.map.layerById[layer.id.split(':')[0]] = vectorLayer;
      }

      if (layer.filter) {
        const [id, filtername] = layer.id.split(':');
        const olLayer = this.map.layerById[id];
        olLayer.addFilter({
          name: filtername,
          filter: feature => {
            return feature.get(layer.filter.attribute).indexOf(layer.filter.value) !== -1;
          },
          color: layer.style.fill
        });
        olLayer.setActive(filtername, layer.visible);
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

  componentWillReceiveProps(props) {
    console.log('componentWillReceiveProps');
    const { layers, visibleLayers } = props;
    // console.log(visibleLayers.toJS());
    layers.toList().forEach(layer => {
      const [id, filter] = layer.id.split(':');
      const olLayer = this.map.layerById[id];
      const visible = visibleLayers.indexOf(layer.id) !== -1;
      if (olLayer) {
        if (filter) {
          olLayer.setActive(filter, visible);
        } else {
          olLayer.setVisible(visible);
        }
      }
    });
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

const visibleLayersSelector = createSelector(
  state => state.layers.layers,
  (layers) => layers.toList().filter(l => l.visible).map(l => l.id)
)

export default connect(state => ({
  title: state.app.title,
  layers: state.layers.layers,
  visibleLayers: visibleLayersSelector(state)
}), dispatch => bindActionCreators({
}, dispatch))(MapComponent);
