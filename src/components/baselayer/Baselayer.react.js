import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Tile from 'ol/layer/tile';
import sourceXYZ from 'ol/source/xyz';
import OSM from 'ol/source/osm';

class Baselayer extends React.Component {

  shouldComponentUpdate() {
    return false;
  }

  componentWillReceiveProps(nextProps) {

    if (nextProps.visible !== this.props.visible) {
      this.layer.setVisible(nextProps.visible)
    }

    if (nextProps.opacity !== this.props.opacity) {
      this.layer.setOpacity(nextProps.opacity)
    }

    if (nextProps.styleId !== this.props.styleId ||
    nextProps.token !== this.props.token ||
    nextProps.tileSize !== this.props.tileSize) {
      const url = this.getSourceURL(nextProps.styleId, nextProps.token, nextProps.tileSize);
      this.layer.getSource().setUrl(url);
    }

  }

  componentDidMount() {
    const { styleId, token, tileSize, visible, opacity } = this.props;

    this.layer = new Tile({
      source: new sourceXYZ({
        url: this.getSourceURL(styleId, token, tileSize),
        attributions: OSM.ATTRIBUTION
      }),
      visible,
      opacity
    });

    this.context.map.addLayer(this.layer);
  }

  getSourceURL(styleId, token, tileSize) {
    return `https://api.mapbox.com/styles/v1/mapbox/${styleId}/tiles/${tileSize}/{z}/{x}/{y}?access_token=${token}`;
  }

  render() {
    return null;
  }
}


Baselayer.propTypes = {
  styleId: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
  opacity: PropTypes.number.isRequired,
  visible: PropTypes.bool.isRequired,
  tileSize: PropTypes.number.isRequired
}


Baselayer.contextTypes = {
  map: PropTypes.object
};


export default connect(state => ({
  styleId: state.baselayer.styleId,
  token: state.baselayer.token,
  opacity: state.baselayer.opacity,
  visible: state.baselayer.visible,
  tileSize: state.baselayer.tileSize
}), dispatch => bindActionCreators({
}, dispatch))(Baselayer);
