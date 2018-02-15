import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import VectorLayer from 'ol/layer/vector';
import VectorSource from 'ol/source/vector';
import proj from 'ol/proj';
import Extent from 'ol/extent';
import debounce from 'lodash/debounce';
import Feature from 'ol/feature';
import Point from 'ol/geom/point';

import Icon from '../../Icon';
import { createLayerStyle } from '../map/styles';
import formatValue from '../identification/format';
import { showObjectInfo } from '../identification/actions';
import messages from '../lang/messages/app';
import './Search.scss';


const API_URL = 'https://geocoder.tilehosting.com/cz/q/${text}.js?key=9zgkXtgp35zBipYQKGI9';

function removeAccents(text) {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

class Search extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      objects: null,
      addresses: null,
      spinner: false
    };
    this.virtualLayer = new VectorLayer({
      source: new VectorSource(),
      visible: true,
      zIndex: 2,
      style: []
    });
    this.virtualLayer.getStyleFunction().highlight = color => createLayerStyle({
      style: {
        type: 'circle',
        radius: 10,
        anchor: [0.5, 0.5],
        // type: 'icon',
        // icon: 'point',
        fill: color
      }
    });
    // this.virtualLayer.set('dataset', 'osm');
    this.searchTable = {
      layers: '',
      records: []
    };
  }

  componentDidMount() {
    const map = this.context.map;
    map.addLayer(this.virtualLayer);
    map.layerById['osm'] = this.virtualLayer;
  }

  createSearchTable() {
    const map = this.context.map;
    const { layers, datasets } = this.props;

    const records = [];
    const visibleLayers = layers.toList().filter(l => l.visible);
    visibleLayers.forEach(l => {
      const olLayer = map.layerById[l.id];
      const dataset = datasets.get(l.datasetId);

      function addFeature(f) {
        const text = dataset.attributes.map(attr => formatValue(f.get(attr.property), attr)).join(' ');
        records.push({
          layerId: l.id,
          featureId: f.ol_uid,
          feature: f,
          label: f.get('name') || f.get('Nazev'),
          text: removeAccents(text)
        });
      }

      olLayer.getSource().forEachFeature(f => {
        const cluster = f.get('features');
        if (cluster) {
          cluster.forEach(addFeature);
        } else {
          addFeature(f);
        }
      });
    });
    this.searchTable = {
      records,
      layers: visibleLayers.map(l => l.id).join(',')
    };
  }

  search(text) {
    if (text === '') {
      // this.virtualLayer.getSource().clear();
      this.setState({objects: null, addresses: null});
      return;
    }

    const { layers } = this.props;
    const layersKey = layers.toList().filter(l => l.visible).map(l => l.id).join(',');

    if (this.searchTable.layers !== layersKey) {
      this.createSearchTable();
    }
    const regex = new RegExp(removeAccents(text), 'i');
    const objects = this.searchTable.records.filter(item => item.text.search(regex) !== -1);

    this.setState({
      objects,
      addresses: null,
      spinner: true
    });

    this.searchAddress(text);
  }

  searchAddress(text) {
    if (this.addressRequest) {
      this.addressRequest.abort();
      this.addressRequest = null;
    }
    const url = API_URL.replace('${text}', text);
    const request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "json";

    request.onload = event => {
      this.setState({addresses: event.target.response, spinner: false});
    };
    request.send();
    this.addressRequest = request;
  }

  onKeyPress(evt) {
    if (evt.key === 'Enter') {
      this.search(this.inputEl.value);
    }
  }

  close() {
    this.setState({
      objects: null,
      addresses: null
    });
  }

  zoomToObject(feature) {
    const map = this.context.map;
    
    return new Promise((resolve, reject) => {
      if (feature.getGeometry().getType() === 'Point') {
        const viewExtent = map.getView().calculateExtent();
        const center = feature.getGeometry().flatCoordinates.slice();
        center[1] += (viewExtent[3] - viewExtent[1])/5;
        map.getView().animate({
          center: center,
          duration: 450,
          // zoom: map.getView().getZoom() // 14
        }, resolve);
      } else {
        const extent = feature.getGeometry().getExtent();
        const buffer = 2 * Math.max(Math.abs(extent[2]-extent[0]), Math.abs(extent[3]-extent[1]));
        map.getView().fit(Extent.buffer(extent, buffer), {duration: 450, callback: resolve});
      }
    });
  }

  showObject(item) {
    const { showObjectInfo } = this.props;
    this.zoomToObject(item.feature).then(() => {
      showObjectInfo(item.featureId, item.layerId);
    });
  }

  showAddress(item) {
    console.log(item);
    const extent = proj.transformExtent(item.boundingbox, 'EPSG:4326', this.props.projCode);
    // this.context.map.getView().fit(extent, {duration: 450, maxZoom: 16});

    const feature = new Feature({
      geometry: new Point(Extent.getCenter(extent)),
    });
    feature.layer = this.virtualLayer;
    feature.setProperties({'': item.display_name});
    // feature.setProperties({
    //   name: item.name + item.name_suffix,
    //   county: item.county.replace(/^okres /, ''),
    //   state: item.state,
    //   type: item.type
    // });
    const source = this.virtualLayer.getSource();
    source.clear();
    source.addFeature(feature);

    this.showObject({
      feature,
      featureId: feature.ol_uid,
      layerId: 'osm'
    });
  }

  renderResults() {
    const { layers } = this.props;
    const objects = this.state.objects || [];
    const addresses = this.state.addresses || {results: [], totalResults: 0};

    const showedObjects = objects.slice(0, 10);
    const hiddenObjectsCount = Math.max(0, objects.length - showedObjects.length);
    const showedAddresses = addresses.results.slice(0, 10);
    const hiddenAddressesCount = Math.max(0, addresses.totalResults - showedAddresses.length);

    const icons = showedObjects.map(item => {
      const style = layers.get(item.layerId).style;
      return style ? style.icon : '';
    });
    return (
      <div className="search-items">
        {showedObjects.map((item, index) => (
          <div key={index} onClick={() => this.showObject(item)}>
            <Icon glyph={icons[index]}></Icon>
            <label>{ item.label }</label>
          </div>
        ))}
        { hiddenObjectsCount > 0 && <small>And another { hiddenObjectsCount } objects</small> }
        <hr />
        <label>
          Adresy { this.state.spinner && <Icon glyph="spinner" className="spinner" /> }
        </label>
        { showedAddresses.map((item, index) => (
          <div key={index} onClick={() => this.showAddress(item)}>
            <label>{ item.display_name }</label>
          </div>
        ))}
        { hiddenAddressesCount > 0 && <small>And another { hiddenAddressesCount } addresses</small> }
      </div>
    );
  }

  render() {
    const { lang } = this.props;
    const { objects, addresses } = this.state;
    const open = objects || addresses;
    return (
      <div className="search-container">
        <div className="search-toolbar">
          <input
            placeholder={messages['search'][lang]}
            ref={el => this.inputEl = el}
            onKeyPress={this.onKeyPress.bind(this)}
            onKeyDown={debounce(() => this.search(this.inputEl.value), 300)}
          />
          <button onClick={() => this.search(this.inputEl.value)}>
            <Icon glyph="search" />
          </button>
        </div>
        {open && <div className="backdrop" onClick={this.close.bind(this)}></div>}
        {open && this.renderResults()}
      </div>
    );
  }
}

Search.contextTypes = {
  map: PropTypes.object.isRequired
};

Search.propTypes = {
  layers: PropTypes.object.isRequired,
  datasets: PropTypes.object.isRequired,
  projCode: PropTypes.string.isRequired,
  lang: PropTypes.string.isRequired
}

export default connect(state => ({
  lang: state.lang.selectedLanguage,
  layers: state.layers.layers,
  datasets: state.layers.datasets,
  projCode: state.view.projCode,
}), dispatch => bindActionCreators({
  showObjectInfo
}, dispatch))(Search);
