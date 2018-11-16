import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { activatePrint } from './actions';
import html2canvas from 'html2canvas';
import canvas2image from 'canvas2image-es6';
import Baselayer from '../baselayer/Baselayer.react';
import './Template.scss';


class PrintTemplate extends React.Component {
  constructor() {
    super();
    this.handlePrint = this.handlePrint.bind(this);
    this.handleDeActivatePrint = this.handleDeActivatePrint.bind(this);
    this.handleAddDistrictPanel = this.handleAddDistrictPanel.bind(this);
    this.state = { width: 210, height: 148, units: 'mm' };
    console.log(canvas2image);
  }

  componentDidMount() {
    this.setMapContainer('#templateMap');
  }

  setMapContainer(selector) {
    const mapEl = this.context.map.getTarget();
    const mapDiv = document.querySelector(selector);
    mapDiv.appendChild(mapEl);
    this.context.map.updateSize();
  }

  handlePrint() {
    const element = document.querySelector('.ci-template');
    const { width, height } = this.state;
    const options = {
      scale: 10,
    };

    html2canvas(element, options).then(canvas => {
      console.log(canvas);
      canvas2image.saveAsJPEG(canvas,  width * 10, height * 10);
    });
  }

  handleDeActivatePrint() {
    const { activatePrint } = this.props;
    this.setMapContainer('#map-container');
    activatePrint(false);
  }

  handleAddDistrictPanel() {
    const district = document.querySelector('.districts-panel');
    const emptyone = document.querySelector('#emptyone');
    console.log(district, emptyone);
    emptyone.appendChild(district);
  }


  renderTopPanel() {
    return (
      <div>
        <div className="categories-menu">
          {''}
        </div>
        <div className="flex-space" />
      </div>
    );
  }

  renderBottomPanel() {
    return (
      <div className="bottom-panel">
        <img className="logo" src="img/plusko.png" />
      </div>
    );
  }

  renderComponent() {
    const { lang } = this.props;
    const { width, height } = this.state;

    const style = {
      width: `${width}mm`,
      height: `${height}mm`
    };

    return (
      <div className="ci-template-backdrop">
        <div className="ci-template-buttons">

          <button onClick={this.handleDeActivatePrint}>
            X
          </button>
          <Baselayer />
          <button onClick={this.handlePrint}>
            p
          </button>
          <button onClick={this.handleAddDistrictPanel}>
            d
          </button>
        </div>
        <div className="ci-template" style={style}>
          <div id="templateMap" />
          { this.renderTopPanel() }
          { this.renderBottomPanel() }
          <div id="emptyone" />
        </div>
      </div>
    );
  }

  render() {
    return ReactDOM.createPortal(this.renderComponent(), document.body);
  }
}


PrintTemplate.propTypes = {
  active: PropTypes.bool.isRequired,
  activatePrint: PropTypes.func.isRequired,
};


PrintTemplate.contextTypes = {
  map: PropTypes.object
};


export default connect(state => ({
  active: state.print.active,
}), dispatch => bindActionCreators({
    activatePrint
}, dispatch))(PrintTemplate);
