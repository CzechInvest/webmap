import React from 'react';
import PropTypes from 'prop-types';
import {
  bindActionCreators
} from 'redux';
import {
  connect
} from 'react-redux';
import {
  createSelector
} from 'reselect';
import {
  Map
} from 'ol';
import 'ol/ol.css';
import './Map.scss';
import {
  Vector as VectorLayer
} from 'ol/layer';
import {
  Vector as VectorSource
} from 'ol/source';
import {
  Cluster
} from 'ol/source';
import {
  GeoJSON
} from 'ol/format';
import JSONFeature from 'ol/format/JSONFeature';
import {
  Attribution
} from 'ol/control';
import {
  defaults
} from 'ol/control';
import {
  MouseWheelZoom
} from 'ol/interaction';

import {
  createLayerStyle,
  createPointStyle,
  coloredPolygonStyle
} from './styles';
import {
  DistinctPointsSource,
  FilteredPointLayer,
  FilteredPolygonLayer
} from './layers';
import Geobuf from './formats';
import AnimatedCluster from './AnimatedClusterLayer';
import axios from 'axios';

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
      controls: defaults({
        attribution: false
      }).extend([attribution])
    });
    // if map is nested inside main page (in iframe or object),
    // adjust mouse wheel zooming to work only in combination with
    // Ctrl or Alt key.
    // (MouseWheelZoom should have 'condition' option in the future)
    if (window.top !== window) {
      const zoomIntercation = this.map.getInteractions().getArray().find(i => i instanceof MouseWheelZoom);
      zoomIntercation._handleEvent = zoomIntercation.handleEvent;
      zoomIntercation.handleEvent = function (e) {
        if (e.type === 'wheel' && !e.originalEvent.ctrlKey && !e.originalEvent.altKey) {
          return true;
        }
        return zoomIntercation._handleEvent(e);
      }
    }
    this.dataSources = {};
    this.createLayers();
    this.state = {
      isMounted: false
    };
  }

  getDataSource(dataset) {
    if (this.dataSources[dataset.id]) {
      return this.dataSources[dataset.id];
    }
    let source;
  
    if (typeof dataset.src === "object") {
      const isPBF = dataset.src.geometry.indexOf('.pbf') !== -1
      source = new VectorSource({
        loader: function (extent, resolution, projection) {
          axios.get(dataUrl(dataset.src.geometry), {
            responseType: isPBF ? 'arraybuffer' : 'json',
          }).then(response => {
            const format = isPBF ? Geobuf({
              dataProjection: 'EPSG:4326',
              featureProjection: 'EPSG:3857',
            }) : new GeoJSON({
              dataProjection: 'EPSG:4326',
              featureProjection: 'EPSG:3857',
            })
            const features = format.readFeatures(response.data);

            this.addFeatures(features);

            axios.get(dataUrl(dataset.src.attributes)).then(response => {
              features.forEach(feature => {
                const kod = feature.get('Kod');
                const properties = response.data.find(data =>
                  data.Kod === kod
                )
                feature.setProperties(properties);
              })
            })
          })
        }
      })

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
    const {
      id,
      filter
    } = layer;
    let fn;
    switch (filter.type) {
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
        fn = feature => feature.get(filter.attribute).indexOf(filter.value) !== -1 ? layer.style.fill : false;
    }

    return {
      id: id,
      filter: fn
    };
  }

  createLayers() {
    this.map.layerById = {};
    const layerByDataset = {};
    const {
      layers,
      datasets
    } = this.props;

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
                zIndex: 1,

                style: layer.style,
                // label: layer.style.label,
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
            source = new Cluster({
              source,
              distance: 30
            })
          }
          const Layer = isPointLayer ? AnimatedCluster : VectorLayer;
          vectorLayer = new Layer({
            source: source,
            visible: layer.visible,
            // style: createLayerStyle(layer),
            style: isPointLayer ? createPointStyle(layer.style) : createLayerStyle(layer),
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
    return {
      map: this.map
    };
  }

  componentDidMount() {
    this.setState({
      isMounted: true
    });
    this.map.setTarget(this.mapEl);
  }

  componentDidUpdate(prevProps) {
    const {
      layers,
      visibleLayers
    } = this.props;

    if (prevProps.layers !== layers || prevProps.visibleLayers !== visibleLayers) {
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
  }

  render() {
    return ( <
      div id = "map"
      ref = {
        node => {
          this.mapEl = node
        }
      } >
      <
      div className = 'ci-zoom' / > {
        this.state.isMounted && this.props.children
      } <
      /div>
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
}), dispatch => bindActionCreators({}, dispatch))(MapComponent);