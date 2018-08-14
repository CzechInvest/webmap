import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setBaselayer } from './actions';
import { Tile } from 'ol/layer';
import './Baselayer.scss';
import messages from '../lang/messages/app';

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
    const { activeLayer, lang } = this.props;

    const img = activeLayer === Baselayer.layerType.ORTOFOTO ?
      Baselayer.layerType.POSITRON : Baselayer.layerType.ORTOFOTO;

    return (
      <div className="ci-switcher">
        <button onClick={this.onClick}
          title={messages['baselayerTitle'][lang]}
          style={{ background: `url('/img/${img}.png') no-repeat`}}
        />
      </div>
    );
  }
}


Baselayer.propTypes = {
  lang: PropTypes.string.isRequired,
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
  lang: state.lang.selectedLanguage
}), dispatch => bindActionCreators({
    setBaselayer
}, dispatch))(Baselayer);
