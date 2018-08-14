import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { unByKey } from 'ol/Observable';
import debounce from 'lodash/debounce';

import { MapStyles } from './styles.js';
import { addDistrictToCompare, removeDistrictToCompare, clearDistrictsSelection } from './actions';
import DistrictsPanel from './DistrictsPanel.react.js';


const featureId = f => f.get('Kod');

class DistrictsComparator extends React.Component {
  constructor() {
    super();
    this.initializeSelection = this.initializeSelection.bind(this);
  }

  initializeOverlay() {
    this.selectionOverlay = new VectorLayer({
      source: new VectorSource(),
      zIndex: 2,
      style: f => MapStyles[this.props.districts.get(featureId(f))['color']]
    });

    this.context.map.addLayer(this.selectionOverlay);
    if (this.olLayer.getSource().getFeatures().length) {
      this.initializeSelection();
    } else {
      // wait for layer's data
      this.olLayer.getSource().once('change', this.initializeSelection);
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
    const { districts } = this.props;
    const usedColors = districts.toList().map(d => d.color);
    const properties = feature.getProperties();
    delete properties.geometry;

    const district = {
      label: properties['Nazev'],
      color: MapStyles.map((c, i) => i).find(index => !usedColors.contains(index)),
      data: properties
    };
    this.props.addDistrictToCompare(featureId(feature), district);
    this.selectionOverlay.getSource().addFeature(feature);
  }

  unselectDistrict(feature) {
    if (this.isSelected(feature)) {
      this.selectionOverlay.getSource().removeFeature(feature);
    }
    this.props.removeDistrictToCompare(featureId(feature));
  }

  toggleSelection(feature) {
    const { districts } = this.props;

    if (!feature) return;
    const isSelected = this.isSelected(feature);

    if (feature === this.temporarySelected) {
      this.temporarySelected = null;
    } else if (isSelected) {
      this.unselectDistrict(feature);
    }
    if (!isSelected && districts.size < 7) {
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

  activate() {
    const { layer, districts } = this.props;
    const map = this.context.map;
    this.olLayer = map.layerById[layer.id];

    this.initializeOverlay();

    const layerFilter = ol => (ol === this.olLayer);

    this.clickListener = map.on('singleclick', e => {
      const f = map.forEachFeatureAtPixel(e.pixel, f => f, { layerFilter });
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

  deactivate() {
    const { clearDistrictsSelection } = this.props;
    this.context.map.removeLayer(this.selectionOverlay);
    unByKey(this.moveListener);
    unByKey(this.clickListener);

    clearDistrictsSelection();
    this.selectionOverlay.getSource().clear();
  }

  updateLayer() {
    const { layer, clearDistrictsSelection } = this.props;
    this.olLayer = this.context.map.layerById[layer.id];
    clearDistrictsSelection();
    this.selectionOverlay.getSource().clear();
  }

  componentDidMount() {
    if (this.props.layer) {
      this.activate();
    }
  }

  componentDidUpdate(prevProps) {
    const prevLayer = (prevProps.layer || {}).id;
    const newLayer = (this.props.layer || {}).id;
    if (!prevLayer && newLayer) {
      this.activate();
    } else if (prevLayer && !newLayer) {
      this.deactivate()
    } else if (prevLayer !== newLayer) {
      this.updateLayer();
    }
  }

  render() {
    const { layer } = this.props;
    const active = Boolean(layer);
    return (
      <TransitionGroup>
        {active && <CSSTransition classNames="slide-left" timeout={{ enter: 300, exit: 300 }}>
          <DistrictsPanel layer={layer} />
        </CSSTransition>}
      </TransitionGroup>
    );
  }
}

DistrictsComparator.propTypes = {
  districts: PropTypes.object,
  layer: PropTypes.object,
  addDistrictToCompare: PropTypes.func.isRequired,
  removeDistrictToCompare: PropTypes.func.isRequired,
  clearDistrictsSelection: PropTypes.func.isRequired
}

DistrictsComparator.contextTypes = {
  map: PropTypes.object
};

export default connect(state => ({
  districts: state.districts.districts,
  layer: state.layers.layers.find(l => l.catId === 'socioeconomic' && l.visible)
}), dispatch => bindActionCreators({
  addDistrictToCompare,
  removeDistrictToCompare,
  clearDistrictsSelection
}, dispatch))(DistrictsComparator);
