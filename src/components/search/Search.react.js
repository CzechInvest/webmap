import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classnames from 'classnames';
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
import { Scrollbars } from 'react-custom-scrollbars';
import './Search.scss';


function searchQueryUrl(text) {
  return `https://geocoder.tilehosting.com/cz/q/${text}.js?key=9zgkXtgp35zBipYQKGI9`
}

function removeAccents(text) {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

class Search extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      focus: false,
      objects: null,
      addresses: null,
      spinner: false
    };
    this.virtualLayer = new VectorLayer({
      source: new VectorSource(),
      visible: true,
      zIndex: 2,
      style: [], // empty style, only highlighted objects should be visible
      // style: createLayerStyle({
      //   style: { type: 'circle', anchor: [0.5, 0.5], fill: 'green' }
      // })
    });
    this.virtualLayer.getStyleFunction().highlight = color => createLayerStyle({
      style: {
        // type: 'icon',
        // icon: 'point',
        type: 'circle',
        radius: 10,
        anchor: [0.5, 0.5],
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
    const url = searchQueryUrl(text);
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
      if (this.state.objects) {
        this.showObjects(this.state.objects);
      }
      this.search(this.inputEl.value);
    } else {
      this.virtualLayer.getSource().clear();
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

  showObjects(items) {
    const map = this.context.map;
    const source = this.virtualLayer.getSource();
    source.clear();
    const features = items.map(i => {
      const f = i.feature.clone()
      let styleFn = map.layerById[i.layerId].getStyleFunction();
      if (styleFn.highlight) {
        styleFn = styleFn.highlight('rgb(229,115,115)');
      }
      f.setStyle(styleFn);
      return f;
    })
    source.addFeatures(features);
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

  itemIcon(item) {
    const { layers, categories } = this.props;
    const layer = layers.get(item.layerId);
    if (layer.style.icon) {
      return <Icon glyph={layer.style.icon}></Icon>
    }
    return <Icon className="category icon" glyph={categories.get(layer.catId).icon}></Icon>
  }

  renderResults() {
    const objects = this.state.objects || [];
    const addresses = this.state.addresses || {results: [], totalResults: 0};

    const showedObjects = objects.slice(0, 10);
    const hiddenObjectsCount = Math.max(0, objects.length - showedObjects.length);
    const showedAddresses = addresses.results.slice(0, 10);
    const hiddenAddressesCount = Math.max(0, addresses.totalResults - showedAddresses.length);

    const bodyBounds = document.body.getBoundingClientRect();
    const maxHeight = Math.round(bodyBounds.height * 0.75)
    // const maxHeight = bodyBounds.height -300
    return (
      <Scrollbars autoHeight autoHeightMax={maxHeight}>
      <div className="search-items">
        {showedObjects.map((item, index) => (
          <div key={index} onClick={() => this.showObject(item)}>
            { this.itemIcon(item) }
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
      </Scrollbars>
    );
  }

  render() {
    const { lang } = this.props;
    const { objects, addresses } = this.state;
    const open = objects || addresses;
    return (
      <div className={classnames("search-container", {focus: this.state.focus, open})} >
        <div className="search-toolbar">
          <input
            placeholder={messages['search'][lang]}
            ref={el => this.inputEl = el}
            onKeyUp={this.onKeyPress.bind(this)}
            onKeyDown={debounce(() => this.search(this.inputEl.value), 300)}
            onFocus={() => this.setState({focus: true})}
            onBlur={() => this.setState({focus: false})}
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
  categories: state.categories.categories,
  projCode: state.view.projCode,
}), dispatch => bindActionCreators({
  showObjectInfo
}, dispatch))(Search);
