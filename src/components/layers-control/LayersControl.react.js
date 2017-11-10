import React from 'react';
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types';
import Control from 'ol/control/control';
import VectorLayer from 'ol/layer/vector';
import VectorSource from 'ol/source/vector';
import GeoJSON from 'ol/format/geojson';
import Fill from 'ol/style/fill';
import Stroke from 'ol/style/stroke';
import Style from 'ol/style/style';
import Text from 'ol/style/text';
import Circle from 'ol/style/circle';

import CategoryLayersMenu from './Menu.react';


function createStyle(config = {}) {
  const style = new Style({
    image: new Circle({
      radius: 7,
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
        color: config.fill
      }),
      stroke: new Stroke({
        color: '#fff',
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

export default class LayersControl extends React.Component {

  componentDidMount() {
    const map = this.context.map;

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
          map.addLayer(vectorLayer);
        }
      })
    });
  }

  componentWillUnmount() {
    document.body.removeChild(this.el);
  }

  render() {
    return (
      <CategoryLayersMenu />
    )
  }
}

LayersControl.contextTypes = {
  map: PropTypes.object,
  store: PropTypes.object.isRequired
};
