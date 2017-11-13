import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Tile from 'ol/layer/tile';
import OSM from 'ol/source/osm';

class TileLayer extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
  }

  shouldComponentUpdate() {
    return false;
  }

  componentDidMount() {
    this.layer = new Tile({
      source: new OSM()
    });
    this.context.map.addLayer(this.layer);
  }


  render() {
    return null;
  }
}


TileLayer.contextTypes = {
  map: PropTypes.object
};

export default connect(state => ({
  title: state.app.title,
}), dispatch => bindActionCreators({
}, dispatch))(TileLayer);
