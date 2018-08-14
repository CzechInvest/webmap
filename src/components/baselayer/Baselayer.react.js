import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setBaselayer } from './actions';
import { Tile } from 'ol/layer';
import './baselayer.scss';

import {setOrtofoto, setPositron} from './config';

class Baselayer extends React.Component {
  constructor() {
    super();
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    const { setBaselayer, activeLayer } = this.props;
    setBaselayer(activeLayer === Baselayer.layerType.ORTOFOTO ?
      Baselayer.layerType.POSITRON : Baselayer.layerType.ORTOFOTO);
  }

  componentDidUpdate(prevProps) {
    const { visible, opacity, activeLayer } = this.props;

    if (prevProps.visible !== visible) {
      this.layer.setVisible(visible)
    }

    if (prevProps.opacity !== opacity) {
      this.layer.setOpacity(opacity)
    }

    if (prevProps.activeLayer !== activeLayer) {
        this.switchSource();
    }

  }

  componentDidMount() {
    const {  visible, opacity } = this.props;

    this.layer = new Tile({
      visible,
      opacity
    });

    this.switchSource();

    this.context.map.addLayer(this.layer);
  }

  switchSource() {
    const { activeLayer } = this.props;
    switch (activeLayer) {
      case Baselayer.layerType.ORTOFOTO:
        return setOrtofoto(this.layer);
      case Baselayer.layerType.POSITRON:
        return setPositron(this.layer);
      default:
        return setPositron(this.layer);
    }

  }

  render() {
    return (
      <div className="ci-switcher">
        <button onClick={this.onClick}>
          ahoj
        </button>
      </div>
    );
  }
}


Baselayer.propTypes = {
  setBaselayer: PropTypes.func.isRequired,
  activeLayer: PropTypes.string.isRequired,
  opacity: PropTypes.number.isRequired,
  visible: PropTypes.bool.isRequired,
};


Baselayer.contextTypes = {
  map: PropTypes.object
};

Baselayer.layerType = {
  ORTOFOTO: 'ortofoto',
  POSITRON: 'positron'
};

export default connect(state => ({
  activeLayer: state.baselayer.activeLayer,
  opacity: state.baselayer.opacity,
  visible: state.baselayer.visible,
}), dispatch => bindActionCreators({
    setBaselayer
}, dispatch))(Baselayer);
