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
import JsonFormat from 'ol/format/jsonfeature';
import Attribution from 'ol/control/attribution';
import control from 'ol/control';
import olFeatureLoader from 'ol/featureloader.js';

import { createLayerStyle, generateColoredDonutStyle, coloredPointIcon, coloredPolygonStyle } from './styles';
import { DistinctPointsSource, FilteredPointLayer, FilteredPolygonLayer } from './layers';
import Geobuf from './formats';
import AnimatedCluster from './animatedclusterlayer';

function dataUrl(path) {
  return process.env.DATA_URL + path
}

class MapComponent extends React.Component {

  constructor(props) {
    super(props);
    const attribution = new Attribution({
      collapsible: false
    });
    this.map = new Map({
      controls: control.defaults({attribution: false}).extend([attribution])
    });
    this.dataSources = {};
    this.createLayers();
  }

  getDataSource(dataset) {
    if (this.dataSources[dataset.id]) {
      return this.dataSources[dataset.id];
    }
    let source;

    if (dataset.src === Object(dataset.src)) {
      source = new VectorSource({
        format: dataset.src.geometry.indexOf('.pbf') !== -1 ? Geobuf() : new GeoJSON(),
        loader(extent, resolution, projection) {
          const json = new JsonFormat();
          json.readFeatures = (resp, params) => JSON.parse(resp);

          olFeatureLoader.loadFeaturesXhr(dataUrl(dataset.src.attributes), json, attributes => {
            source.data = attributes
            const attributesKey = dataset.src.attributesId;
            const geometryKey = dataset.src.geometryId;

            const attributesById = {};
            attributes.forEach(obj => attributesById[obj[attributesKey]] = obj);

            olFeatureLoader.loadFeaturesXhr(
              dataUrl(dataset.src.geometry),
              this.format_,
              features => {
                // console.log(features.length, attributes.length);
                features.forEach((f, index) => {
                  const id = f.get(geometryKey);
                  // console.log(f.getProperties(), attributesById[id]);
                  f.setProperties(attributesById[id]);
                });
                this.addFeatures(features);
                // with filter of not paired features
                // this.addFeatures(features.filter(f => attributesById[f.get(geometryKey)]));
              }
            )(extent, resolution, projection);
          })();
        }
      });
    } else {
      source = new VectorSource({
        url: dataUrl(dataset.src),
        format: dataset.src.indexOf('.pbf') !== -1 ? Geobuf() : new GeoJSON(),
      });
    }

    if (dataset.geometryType === 'point') {
      source = DistinctPointsSource(source);
    }
    this.dataSources[dataset.id] = source;
    return source;
  }

  createFilter(layer) {
    const { id, filter } = layer;
    let fn;
    switch(filter.type) {
      case 'single': {
        fn = feature => feature.get(filter.attribute) === filter.value ? layer.style.fill : false;
        break;
      }
      case 'oneOf': {
        const colors = layer.style.map(s => s.fill);
        fn = feature => colors[filter.values.indexOf(feature.get(filter.attribute))];
        break;
      }
      default:
        fn  = feature => feature.get(filter.attribute).indexOf(filter.value) !== -1 ? layer.style.fill : false;
    }

    return {
      id: id,
      filter: fn
    };
  }

  createLayers() {
    this.map.layerById = {};
    const layerByDataset = {};
    const { layers, datasets } = this.props;

    layers.forEach(l => {
      const layer = l.toJS();

      // if (layer.datasetId && !layerByDataset[layer.datasetId]) {
      if (layer.datasetId) {
        const dataset = datasets.get(layer.datasetId);
        const layerDatasetKey = `${layer.catId}:${layer.datasetId}`;
        let source = this.getDataSource(dataset);
        const isPointLayer = dataset.geometryType === 'point';

        let vectorLayer;
        if (layer.filter) {
          if (!layerByDataset[layerDatasetKey]) {
            if (isPointLayer) {
              vectorLayer = FilteredPointLayer({
                source: source,
                label: layer.style.label,
                zIndex: 1,
                styleFn: layer.style.icon? coloredPointIcon(layer.style) : generateColoredDonutStyle
              });
            } else {
              vectorLayer = FilteredPolygonLayer({
                source: source,
                zIndex: 1,
                styleFn: coloredPolygonStyle(layer.style[0])
              });
            }
            layerByDataset[layerDatasetKey] = vectorLayer;
          }

          const olLayer = layerByDataset[layerDatasetKey];
          this.map.layerById[layer.id] = olLayer;

          olLayer.addFilter(this.createFilter(layer));
          olLayer.setActive(layer.id, layer.visible);

          if (!vectorLayer) {
            // OL layer already initialized and added to map
            return;
          }
        }
        if (layer.filter && !isPointLayer) {
          /*
          const rootSource = source;
          const layerSource = new VectorSource({
            loader: function(extent, resolution, projection) {
              rootSource.loadFeatures(extent, resolution, projection);
            }
          });
          rootSource.once('change', () => {
            // console.log(rootSource.getFeatures().map(f => f.get('granty')));
            const features = rootSource.getFeatures().filter(f => f.get(layer.filter.attribute) === layer.filter.value);
            layerSource.clear();
            layerSource.addFeatures(features);
          });
          source = layerSource;
          */
        }
        if (!vectorLayer) {
          if (isPointLayer) {
            source = new Cluster({source, distance: 30})
          }
          const Layer = isPointLayer ? AnimatedCluster : VectorLayer;
          vectorLayer = new Layer({
            source: source,
            visible: layer.visible,
            style: createLayerStyle(layer),
            zIndex: 1
          });
        }
        vectorLayer.set('id', layer.id);
        vectorLayer.set('dataset', layer.datasetId);
        this.map.addLayer(vectorLayer);
        this.map.layerById[layer.id] = vectorLayer;
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
        if (layer.filter && olLayer.setActive) {
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
  layers => layers.toList().filter(l => l.visible).map(l => l.id)
)

export default connect(state => ({
  layers: state.layers.layers,
  datasets: state.layers.datasets,
  visibleLayers: visibleLayersSelector(state)
}), dispatch => bindActionCreators({
}, dispatch))(MapComponent);
