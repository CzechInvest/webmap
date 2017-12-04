import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import VectorLayer from 'ol/layer/vector';
import VectorSource from 'ol/source/vector';
import Observable from 'ol/observable';
// import throttle from 'lodash/throttle';
import debounce from 'lodash/debounce';

import { MapStyles } from './styles.js';
import { addDistrictToCompare, removeDistrictToCompare } from './actions';
import { setLayerVisibility } from '../layers/actions';
import DistrictsPanel from './DistrictsPanel.react.js';


const featureId = f => f.get('Kod');

class DistrictsComparator extends React.Component {

  initializeOverlay() {
    this.selectionOverlay = new VectorLayer({
      source: new VectorSource(),
      zIndex: 2,
      style: f => MapStyles[f.get('Kod')]
    });
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
    this.selectionOverlay.getSource().addFeatures(activeFeatures);
  }

  isSelected(feature) {
    return this.props.districts.has(featureId(feature));
    // return this.selectionOverlay.getSource().getFeatures().find(f => f === feature);
  }

  selectDistrict(feature) {
    const properties = feature.getProperties();
    delete properties.geometry;
    this.selectionOverlay.getSource().addFeature(feature);
    this.props.addDistrictToCompare(featureId(feature), properties);
  }

  unselectDistrict(feature) {
    if (this.isSelected(feature)) {
      this.selectionOverlay.getSource().removeFeature(feature);
    }
    this.props.removeDistrictToCompare(featureId(feature));
  }

  toggleSelection(feature) {
    if (!feature) return;
    const isSelected = this.isSelected(feature);

    if (feature === this.temporarySelected) {
      this.temporarySelected = null;
    } else if (isSelected) {
      this.unselectDistrict(feature);
    }
    if (!isSelected) {
      this.selectDistrict(feature);
    }
  }

  hoverChanged(prevFeature, feature) {
    if (prevFeature && prevFeature === this.temporarySelected) {
      this.unselectDistrict(prevFeature);
      this.temporarySelected = null;
    }
    if (feature && !this.isSelected(feature)) {
      this.selectDistrict(feature);
      this.temporarySelected = feature;
    }
  }

  componentDidMount() {
    const { layer, setLayerVisibility } = this.props;
    const map = this.context.map;
    this.olLayer = map.layerById[layer.id];

    setLayerVisibility(layer.id, true);
    this.initializeOverlay();

    const layerFilter = ol => (ol === this.olLayer);

    this.clickListener = map.on('singleclick', (e) => {
      const f = map.forEachFeatureAtPixel(e.pixel, f => f, {layerFilter});
      this.toggleSelection(f);
      e.stopPropagation();
    });

    let prevFeature;
    this.moveListener = map.on('pointermove', debounce(e => {
      const f = map.forEachFeatureAtPixel(e.pixel, f => f, {layerFilter});
      if (f !== prevFeature) {
        this.hoverChanged(prevFeature, f);
        prevFeature = f;
      }
    }, 50));
  }

  componentWillUnmount() {
    const { layer, setLayerVisibility } = this.props;
    this.context.map.removeLayer(this.selectionOverlay);
    Observable.unByKey(this.moveListener);
    Observable.unByKey(this.clickListener);
    setLayerVisibility(layer.id, false);
  }

  render() {
    return (
      <DistrictsPanel />
    );
  }
}

DistrictsComparator.propTypes = {
  districts: PropTypes.object,
  layer: PropTypes.object,
  addDistrictToCompare: PropTypes.func.isRequired,
  removeDistrictToCompare: PropTypes.func.isRequired,
  setLayerVisibility: PropTypes.func.isRequired
}

DistrictsComparator.contextTypes = {
  map: PropTypes.object
};

export default connect(state => ({
  districts: state.districts.districts,
  layer: state.layers.layers.get('kraje')
}), dispatch => bindActionCreators({
  addDistrictToCompare,
  removeDistrictToCompare,
  setLayerVisibility
}, dispatch))(DistrictsComparator);
