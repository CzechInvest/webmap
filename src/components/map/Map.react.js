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
    const layerByDataset = {};
    const { layers, datasets } = this.props;
    layers.forEach(l => {
      const layer = l.toJS();

      if (layer.datasetId && !layerByDataset[layer.datasetId]) {
        const dataset = datasets.get(layer.datasetId);
        let vectorLayer;
        let source = new VectorSource({
          url: dataset.src,
          format: dataset.src.endsWith('.pbf')? Geobuf() : new GeoJSON()
        });

        if (layer.filter) {
          vectorLayer = FilteredPointLayer({
            source: source,
            label: layer.style.label
          });
        } else {
          vectorLayer = new VectorLayer({
            source: dataset.geometryType === 'point' ? new Cluster({source}) : source,
            visible: layer.visible,
            style: createLayerStyle(layer)
          });
        }
        vectorLayer.set('id', layer.id);
        vectorLayer.set('dataset', layer.datasetId);
        this.map.addLayer(vectorLayer);
        this.map.layerById[layer.id] = vectorLayer;
        layerByDataset[layer.datasetId] = vectorLayer;
      }

      if (layer.filter) {
        const olLayer = layerByDataset[layer.datasetId];
        this.map.layerById[layer.id] = olLayer;
        olLayer.addFilter({
          name: layer.id,
          filter: feature => {
            return feature.get(layer.filter.attribute).indexOf(layer.filter.value) !== -1;
          },
          color: layer.style.fill
        });
        olLayer.setActive(layer.id, layer.visible);
      }
    });
  }

  getChildContext() {
    return { map: this.map };
  }

  shouldComponentUpdate() {
    return false;
  }

  getChildContext() {
    return { map: this.map };
  }

  componentDidMount() {
    this.createLayers();
    this.map.setTarget(this.mapEl);
  }

  componentWillReceiveProps(props) {
    const { layers, visibleLayers } = props;
    layers.toList().forEach(layer => {
      const olLayer = this.map.layerById[layer.id];
      const visible = visibleLayers.indexOf(layer.id) !== -1;
      if (olLayer) {
        if (layer.filter) {
          olLayer.setActive(layer.id, visible);
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

MapComponent.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
};

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
  datasets: state.layers.datasets,
  visibleLayers: visibleLayersSelector(state)
}), dispatch => bindActionCreators({
}, dispatch))(MapComponent);
