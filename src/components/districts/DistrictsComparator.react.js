import React from 'react';
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import VectorLayer from 'ol/layer/vector';
import VectorSource from 'ol/source/vector';
import Observable from 'ol/observable';
import Fill from 'ol/style/fill';
import Stroke from 'ol/style/stroke';
import Style from 'ol/style/style';

import { cssColor } from '../map/styles';
import { addDistrictToCompare, removeDistrictToCompare } from './actions';
import { setLayerVisibility } from '../layers/actions';
import './DistrictsComparator.scss';

const COLORS = {
  19: [255,235,59 ,0.5],
  27: [76,175,80 ,0.5],
  35: [255,87,34 ,0.5],
  43: [63,81,181 ,0.5],
  51: [233,30,99 ,0.5],
  60: [156,39,176 ,0.5],
  78: [69,90,100 ,0.6],
  86: [118,255,3 ,0.5],
  108: [213,0,0 ,0.5],
  94: [121,85,72 ,0.6],
  116: [0,137,123 ,0.5],
  124: [48,63,159 ,0.5],
  132: [10,10,10, 0.6],
  141: [196,160,0, 0.5]
}

const STYLES = {};
Object.keys(COLORS).forEach(key => {
  STYLES[key] = new Style({
    fill: new Fill({color: COLORS[key]})
  });
});

const featureId = f => f.get('Kod');

class DistrictsComparator extends React.Component {

  constructor(props) {
    super(props);
    this.highlightFeature = this.highlightFeature.bind(this);
    this.toggleSelection = this.toggleSelection.bind(this);
  }

  initializeOverlays() {
    this.selectionOverlay = new VectorLayer({
      source: new VectorSource(),
      zIndex: 2,
      style: f => STYLES[f.get('Kod')]
    });
    this.hoverOverlay = new VectorLayer({
      source: new VectorSource(),
      zIndex: 2,
      style: f => STYLES[f.get('Kod')]
    });
    this.context.map.addLayer(this.hoverOverlay);
    this.context.map.addLayer(this.selectionOverlay);
    if (this.olLayer.getSource().getFeatures().length) {
      this.initializeSelection();
    } else {
      // wait for layer's data
      this.olLayer.getSource().once('change', this.initializeSelection, this);
    }
  }

  initializeSelection() {
    const { districts } = this.props;
    const activeFeatures = this.olLayer.getSource().getFeatures().filter(f => districts.has(featureId(f)));
    this.selectionOverlay.getSource().clear();
    this.selectionOverlay.getSource().addFeatures(activeFeatures);
  }

  isSelected(feature) {
    return this.selectionOverlay.getSource().getFeatures().find(f => f === feature);
  }

  addDistrictToCompare(feature) {
    const properties = feature.getProperties();
    delete properties.geometry;
    this.props.addDistrictToCompare(featureId(feature), properties);
  }

  toggleSelection(feature) {
    if (this.isSelected(feature)) {
      this.selectionOverlay.getSource().removeFeature(feature);
      this.props.removeDistrictToCompare(featureId(feature));
    } else {
      this.selectionOverlay.getSource().addFeature(feature);
      // it should be already added with hover,
      // but in some circumstances it may not be true
      this.addDistrictToCompare(feature);
    }
  }

  highlightFeature(feature) {
    const source = this.hoverOverlay.getSource();
    const currentHighlight = source.getFeatures()[0];
    if (currentHighlight !== feature) {
      source.clear();
      if (currentHighlight && !this.isSelected(currentHighlight)) {
        this.props.removeDistrictToCompare(featureId(currentHighlight));
      }
      if (feature) {
        source.addFeature(feature);
        this.addDistrictToCompare(feature);
      }
    }
  }

  componentDidMount() {
    const { layer, setLayerVisibility } = this.props;
    const map = this.context.map;
    this.olLayer = map.layerById[layer.id];

    setLayerVisibility(layer.id, true);
    this.initializeOverlays();

    const layerFilter = ol => (ol === this.olLayer);
    this.moveListener = map.on('pointermove', (e) => {
      this.highlightFeature(
        map.forEachFeatureAtPixel(e.pixel, f => f, {layerFilter})
      );
    });
    this.clickListener = map.on('singleclick', (e) => {
      map.forEachFeatureAtPixel(e.pixel, this.toggleSelection, {layerFilter});
      e.stopPropagation();
    });
  }

  componentWillUnmount() {
    const { layer, setLayerVisibility } = this.props;
    this.context.map.removeLayer(this.hoverOverlay);
    this.context.map.removeLayer(this.selectionOverlay);
    Observable.unByKey(this.moveListener);
    Observable.unByKey(this.clickListener);
    setLayerVisibility(layer.id, false);
  }

  render() {
    const { districts, dataset } = this.props;
    const colorStyle = (id) => ({color: cssColor(COLORS[id].slice(0, 3).concat(1))});
    // console.log(dataset.toJS());
    return (
      <div className="districts-panel">
        <h3>Populace</h3>
        {districts.toList().map((properties, id) => (
          <p key={id} style={colorStyle(properties.Kod)}>{properties["Populace"]}</p>
        ))}
        <h3>Pracovní síla</h3>
        {districts.toList().map((properties, id) => (
          <p key={id} style={colorStyle(properties.Kod)}>{properties["Pracovní_síla"]}</p>
        ))}
        <h3>Počet nezam.</h3>
        {districts.toList().map((properties, id) => (
          <p key={id} style={colorStyle(properties.Kod)}>{properties["Počet_nezam"]}</p>
        ))}
      </div>
    );
  }
}

DistrictsComparator.contextTypes = {
  map: PropTypes.object
};

export default connect(state => ({
  districts: state.districts.districts,
  layer: state.layers.layers.get('kraje'),
  dataset: state.layers.datasets.get('kraje')
}), dispatch => bindActionCreators({
  addDistrictToCompare,
  removeDistrictToCompare,
  setLayerVisibility
}, dispatch))(DistrictsComparator);
