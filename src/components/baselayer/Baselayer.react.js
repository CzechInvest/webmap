import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setBaselayer } from './actions';
import { Tile } from 'ol/layer';
import './Baselayer.scss';
import messages from '../lang/messages/app';

import { setSourceToLayer, baseLayerType } from './config';

class Baselayer extends React.Component {
  constructor() {
    super();
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    const { setBaselayer, activeLayer } = this.props;
    setBaselayer(activeLayer === baseLayerType.ORTO ?
      baseLayerType.POSITRON : baseLayerType.ORTO);
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
        setSourceToLayer(activeLayer, this.layer);
    }

  }

  componentDidMount() {
    const {  visible, opacity, activeLayer } = this.props;

    this.layer = new Tile({
      visible,
      opacity
    });

    setSourceToLayer(activeLayer, this.layer);

    this.context.map.addLayer(this.layer);
  }

  render() {
    const { activeLayer, lang } = this.props;

    const img = activeLayer === baseLayerType.ORTO ?
      baseLayerType.POSITRON : baseLayerType.ORTO;

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


export default connect(state => ({
  activeLayer: state.baselayer.activeLayer,
  opacity: state.baselayer.opacity,
  visible: state.baselayer.visible,
  lang: state.lang.selectedLanguage
}), dispatch => bindActionCreators({
    setBaselayer
}, dispatch))(Baselayer);
