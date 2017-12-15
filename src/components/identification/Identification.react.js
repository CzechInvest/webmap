import React from 'react';
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Overlay from 'ol/overlay';
import Select from 'ol/interaction/select';
import Extent from 'ol/extent';

import formatValue from './format';
import Popup from './Popup.react';

import messages from '../lang/messages/attributes';



class Identification extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      object: null
    };
    const el = document.createElement('div');
    el.className = "ol-popup";
    this.overlay = new Overlay({
      // element: document.createElement('div'),
      element: el,
      autoPan: true,
      autoPanAnimation: {
        duration: 250
      }
    });

    this.select = new Select({
      // style(f, res) {
      //   const layer = select.getLayer(f);
      //   return layer.getStyleFunction()(f, res);
      // }
    });
  }

  clearSelection() {
    this.position = undefined;
    this.select.getFeatures().clear();
    this.setState({object: null});
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
    this.clearSelection();
  }

  getObjectInfo(feature, olayer) {
    const { layers, datasets, lang } = this.props;
    const dataset = datasets.get(olayer.get('dataset'));
    let fields;
    if (dataset.attributes.length) {
      fields = dataset.attributes.map(attr => ({
        label: messages[attr.property][lang],
        value: formatValue(feature.get(attr.property), attr),
        html: attr.type === 'html'
      }));
    } else {
      // temporary automatic collecting of fields without any configuration
      fields = feature.getKeys()
        .filter(property => (property !== 'geometry' && property !== 'features'))
        .map((property) => ({
          label: property,
          value: formatValue(feature.get(property))
        }));
    }

    return {
      title: (dataset.title || layers.get(olayer.get('id')).title)[lang],
      fields: fields
    };
  }

  componentDidMount() {
    const map = this.context.map;

    this.select.on('select', (e) => {
      let feature = e.selected[0];
      if (!feature) {
        return this.clearSelection();
      }
      const layer = e.target.getLayer(feature);
      // refresh cluster source to make selected feature visible again
      layer.getSource().refresh();

      const featuresGroup = feature.get('features');
      if (featuresGroup && featuresGroup.length > 1) {
        return this.zoomToCluster(feature);
      } else {
        // cluster of single object => extract it
        if (featuresGroup) {
          feature = featuresGroup[0];
        }
        if (feature.getGeometry().getType() === 'Point') {
          this.position = feature.getGeometry().getFirstCoordinate();
        } else {
          this.position = e.mapBrowserEvent.coordinate;
        }
      }
      this.setState({
        object: this.getObjectInfo(feature, layer)
      });
    });
    map.addOverlay(this.overlay);
    map.addInteraction(this.select);
  }

  /* Update position after rendering to make autopan work properly */
  componentDidUpdate() {
    this.overlay.setPosition(this.position);
  }

  render() {
    if (this.state.object) {
      return ReactDOM.createPortal(
        <Popup
          {...this.state.object}
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
}), dispatch => bindActionCreators({
}, dispatch))(Identification);
