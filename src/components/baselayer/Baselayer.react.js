import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setBaselayer } from './actions';
import { Group } from 'ol/layer';
import './Baselayer.scss';
import messages from '../lang/messages/app';

import { setLayers, baseLayerType } from './config';

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
    const { visible, opacity, activeLayer, datasets } = this.props;

    if (prevProps.visible !== visible) {
      this.layerGroup.setVisible(visible)
    }

    if (prevProps.opacity !== opacity) {
      this.layerGroup.setOpacity(opacity)
    }

    if (prevProps.activeLayer !== activeLayer) {
        setLayers(activeLayer, this.layerGroup, datasets, this.context.map);
    }

  }

  componentDidMount() {
    const {  visible, opacity, activeLayer, datasets } = this.props;

    this.layerGroup = new Group({
      visible,
      opacity
    });

    setLayers(activeLayer, this.layerGroup, datasets, this.context.map);
    this.context.map.addLayer(this.layerGroup);
  }

  renderSwitcher() {
    const { activeLayer, lang } = this.props;

    const img = activeLayer === baseLayerType.ORTO ?
      baseLayerType.POSITRON : baseLayerType.ORTO;

    return (
      <button onClick={this.onClick}
        title={messages['baselayerTitle'][lang]}
        style={{ background: `url('img/${img}.png') no-repeat`}}
      />
    );
  }

  render() {
    const { renderToBody, printActive } = this.props;
    return (renderToBody && !printActive) ? ReactDOM.createPortal( <div  className="ci-switcher"> {this.renderSwitcher()} </div>, document.body) : this.renderSwitcher();
  }
}


Baselayer.propTypes = {
  printActive: PropTypes.bool.isRequired,
  lang: PropTypes.string.isRequired,
  setBaselayer: PropTypes.func.isRequired,
  activeLayer: PropTypes.string.isRequired,
  opacity: PropTypes.number.isRequired,
  datasets: PropTypes.object.isRequired,
  visible: PropTypes.bool.isRequired,
  renderToBody: PropTypes.bool.isRequired,
};


Baselayer.contextTypes = {
  map: PropTypes.object
};


export default connect(state => ({
  printActive: state.print.active,
  activeLayer: state.baselayer.activeLayer,
  opacity: state.baselayer.opacity,
  visible: state.baselayer.visible,
  lang: state.lang.selectedLanguage,
  datasets: state.layers.datasets
}), dispatch => bindActionCreators({
    setBaselayer
}, dispatch))(Baselayer);
