import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Map from 'ol/map';
import './Map.scss';
import VectorLayer from 'ol/layer/vector';
import VectorSource from 'ol/source/vector';
import GeoJSON from 'ol/format/geojson';
import Fill from 'ol/style/fill';
import Stroke from 'ol/style/stroke';
import Style from 'ol/style/style';
import Text from 'ol/style/text';
import Circle from 'ol/style/circle';

function createStyle(config = {}) {
  const style = new Style({
    image: new Circle({
      radius: config.radius || 7,
      stroke: new Stroke({
        color: 'white',
        width: 2
      }),
      fill: new Fill({
        color: config.fill
      })
    }),
    text: new Text({
      font: '13px Calibri,sans-serif',
      textBaseline: 'top',
      offsetY: 6,
      fill: new Fill({
        color: '#444'
      }),
      stroke: new Stroke({
        color: config.fill,
        width: 2
      })
    })
  });
  if (config.label) {
    return feature => {
      style.getText().setText(feature.get(config.label));
      return style;
    }
  }
  return [style];
}


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
    const categories = this.context.store.getState().map.categories;
    categories.forEach(category => {
      category.layers.forEach(layer => {
        if (layer.source) {

          const vectorLayer = new VectorLayer({
            source: new VectorSource({
              url: layer.source,
              format: new GeoJSON()
            }),
            visible: layer.visible,
            style: layer.style ? createStyle(layer.style) : undefined
          });
          vectorLayer.set('name', layer.name);
          this.map.addLayer(vectorLayer);
        }
      })
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

MapComponent.contextTypes = {
  store: PropTypes.object.isRequired
};

MapComponent.childContextTypes = {
  map: PropTypes.instanceOf(Map)
};

export default connect(state => ({
  title: state.app.title,
}), dispatch => bindActionCreators({
}, dispatch))(MapComponent);
