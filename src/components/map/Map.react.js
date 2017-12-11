import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import Map from 'ol/map';
import 'ol/ol.css';
import './Map.scss';
import VectorLayer from 'ol/layer/vector';
import VectorSource from 'ol/source/vector';
import Cluster from 'ol/source/cluster';
import GeoJSON from 'ol/format/geojson';
import Attribution from 'ol/control/attribution';
import control from 'ol/control';

import { createLayerStyle } from './styles';
import { DistinctPointsSource, FilteredPointLayer } from './layers';
import Geobuf from './formats';


class MapComponent extends React.Component {

  constructor(props) {
    super(props);
    const attribution = new Attribution({
      collapsible: false
    });
    this.map = new Map({
      controls: control.defaults({attribution: false}).extend([attribution])
    });
    this.createLayers();
  }

  createLayers() {
    this.map.layerById = {};
    const layerByDataset = {};
    const { layers, datasets } = this.props;
    layers.forEach(l => {
      const layer = l.toJS();

      if (layer.datasetId && !layerByDataset[layer.datasetId]) {
        const dataset = datasets.get(layer.datasetId);

        let source = new VectorSource({
          url: dataset.src,
          format: dataset.src.indexOf('.pbf') !== -1 ? Geobuf() : new GeoJSON()
        });
        if (dataset.geometryType === 'point') {
          source = DistinctPointsSource(source);
        }

        let vectorLayer;
        if (layer.filter) {
          vectorLayer = FilteredPointLayer({
            source: source,
            label: layer.style.label,
            zIndex: 1
          });
        } else {
          vectorLayer = new VectorLayer({
            source: dataset.geometryType === 'point' ? new Cluster({source, distance: 30}) : source,
            visible: layer.visible,
            style: createLayerStyle(layer),
            zIndex: 1
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

  componentDidMount() {
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
  layers: state.layers.layers,
  datasets: state.layers.datasets,
  visibleLayers: visibleLayersSelector(state)
}), dispatch => bindActionCreators({
}, dispatch))(MapComponent);
