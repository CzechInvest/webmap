import React from 'react';
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Overlay from 'ol/overlay';
import VectorLayer from 'ol/layer/vector';
import VectorSource from 'ol/source/vector';
import Extent from 'ol/extent';

import { showObjectInfo } from './actions';
import formatValue from './format';
import Popup from './Popup.react';
import messages from '../lang/messages/attributes';


class Identification extends React.Component {

  constructor(props) {
    super(props);
    const el = document.createElement('div');
    el.className = "ol-popup";
    this.overlay = new Overlay({
      element: el,
      autoPan: true,
      autoPanAnimation: {
        duration: 250
      }
    });

    this.highlightOverlay = new VectorLayer({
      source: new VectorSource(),
      visible: true,
      zIndex: 3,
      style(f, res) {
        const styleFn = f.layer.getStyleFunction();
        if (styleFn.highlight) {
          return styleFn.highlight('red')(f, res);
        }
      }
    });
  }

  highlight(feature, layer) {
    feature.layer = layer;
    this.highlightOverlay.getSource().clear();
    this.highlightOverlay.getSource().addFeature(feature);
  }

  clearSelection() {
    this.position = undefined;
    this.overlay.setPosition(this.position);

    this.highlightOverlay.getSource().clear();
    const { showObjectInfo } = this.props;
    showObjectInfo(null);
  }

  zoomToCluster(feature) {
    const map = this.context.map;
    const extent = feature.getGeometry().getExtent();
    const features = feature.get('features');
    if (features.length < 5) {
      features.forEach(f => Extent.extend(extent, f.getGeometry().getExtent()));
      const buffer = 2 * Math.max(Math.abs(extent[2]-extent[0]), Math.abs(extent[3]-extent[1]));
      map.getView().fit(Extent.buffer(extent, buffer), {duration: 450});
    } else {
      const center = [
        (extent[0] + extent[2])/2,
        (extent[1] + extent[3])/2
      ];
      map.getView().animate({
        center: center,
        duration: 450,
        zoom: map.getView().getZoom()+1
      });
    }
  }

  getObjectInfo(feature, olayer) {
    const { layers, datasets, lang } = this.props;
    const dataset = datasets.get(olayer.get('dataset'));
    // const dataset = null; // for debugging to show raw names and values of all fields

    let fields;
    if (dataset) {
      fields = dataset.attributes
        .filter(attr => feature.get(attr.property) !== undefined)
        .map(attr => ({
          label: messages[attr.property][lang],
          value: formatValue(feature.get(attr.property), attr),
          html: attr.type === 'html'
        }));
    } else {
      fields = feature.getKeys()
      .filter(property => (property !== 'geometry' && property !== 'features'))
      .map((property) => ({
        label: property,
        value: feature.get(property)
      }));
    }

    let layerId;
    const hasMoreLayers = layers.filter(l => l.datasetId === olayer.get('dataset')).size > 1;
    if (hasMoreLayers) {
      const layersIds = olayer.featureFilters(feature);
      if (layersIds.length === 1) {
        layerId = layersIds[0];
      }
    } else {
      layerId = olayer.get('id')
    }
    return {
      title: layerId ? layers.get(layerId).title[lang] : undefined,
      fields: fields
    };
  }

  componentDidMount() {
    const { layers, showObjectInfo } = this.props;
    const map = this.context.map;

    map.on('singleclick', (e) => {
      // console.log('singleclick: identification');
      let { feature, layer } = map.forEachFeatureAtPixel(
        e.pixel,
        (feature, layer) => ({feature, layer}),
        {layerFilter: l => l.get('dataset')}
        // {layerFilter: l => l.get('id') && layers.get(l.get('id')).identifiable}
      ) || {};

      if (!feature || !(layers.get(layer.get('id')) || {}).identifiable) {
        return this.clearSelection();
      }

      const featuresGroup = feature.get('features');
      if (featuresGroup && featuresGroup.length > 1) {
        return this.zoomToCluster(feature);
      } else {
        // cluster of single object => extract it
        if (featuresGroup) {
          feature = featuresGroup[0];
        }
        showObjectInfo(feature.ol_uid, layer.get('id'), e.coordinate);
      }
    });
    map.addOverlay(this.overlay);
    map.addLayer(this.highlightOverlay);
  }

  /* Update position after rendering to make autopan work properly */
  componentDidUpdate(prevProps) {
    this.overlay.setPosition(this.position);
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.object !== this.props.object || nextProps.lang !== this.props.lang;
  }

  render() {
    const { object } = this.props;
    if (object) {
      const olLayer = this.context.map.layerById[object.layerId];

      let source = olLayer.getSource();
      if (source.getSource) {
        source = source.getSource();
      }
      const feature = source.getFeatures().find(f => f.ol_uid === object.featureId);
      this.highlight(feature, olLayer);

      const geom = feature.getGeometry();
      let offset = [0, -2];
      switch (geom.getType()) {
        case 'Point':
          this.position = geom.getFirstCoordinate();
          offset = [4, -12];
          break;
        case 'Polygon':
          this.position = object.marker || geom.getInteriorPoint().flatCoordinates;
          break;
        case 'MultiPolygon':
          this.position = object.marker || geom.getPolygon(0).getInteriorPoint().flatCoordinates;
          break;
        default:
          this.position = object.marker || Extent.getCenter(geom.getExtent());
      }
      this.overlay.setOffset(offset);

      const objectData = this.getObjectInfo(feature, olLayer);
      return ReactDOM.createPortal(
        <Popup
          {...objectData}
          onClose={() => {this.clearSelection()}}/>,
        this.overlay.getElement()
      );
    }
    return null;
  }
}

Identification.propTypes = {
  layers: PropTypes.object.isRequired,
  datasets: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired
}

Identification.contextTypes = {
  map: PropTypes.object.isRequired,
};

export default connect(state => ({
  layers: state.layers.layers,
  datasets: state.layers.datasets,
  lang: state.lang.selectedLanguage,
  object: state.identification.object
}), dispatch => bindActionCreators({
  showObjectInfo
}, dispatch))(Identification);
