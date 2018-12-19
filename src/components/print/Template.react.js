import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { activatePrint } from './actions';
import html2canvas from 'html2canvas';
import FileSaver from 'file-saver';
import Baselayer from '../baselayer/Baselayer.react';
import Icon from '../../Icon';
import messages from '../lang/messages/app';
import './Template.scss';
import { throws } from 'assert';


class PrintTemplate extends React.Component {
  constructor() {
    super();
    this.handlePrint = this.handlePrint.bind(this);
    this.handleDeActivatePrint = this.handleDeActivatePrint.bind(this);
    this.handleAddDistrictPanel = this.handleAddDistrictPanel.bind(this);
    this.state = { width: 210, height: 148, units: 'mm', ratio: 1 };
  }

  componentDidMount() {
    const { ratio } = this.state;
    this.setMapContainer('#templateMap');
    const template = document.querySelector('.ci-template');
    const height = template.offsetHeight;
    const width = template.offsetWidth;

    const dw = (window.innerWidth - 20) - width ;
    const dh = (window.innerHeight - 120) - height;
    
    const rdw = (window.innerWidth - 20 - dw) / (window.innerWidth - 20);
    const rdh =  (window.innerHeight - 120 - dh) / (window.innerHeight - 120);

    this.setState({ ratio: Math.min(ratio / rdw, ratio / rdh) });
  }

  componentDidUpdate() {
    this.context.map.updateSize();
  }

  setMapContainer(selector) {
    const mapEl = this.context.map.getTarget();
    const mapDiv = document.querySelector(selector);
    mapDiv.appendChild(mapEl);
    this.context.map.updateSize();
  }

  dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const dw = new DataView(ab);
    for (let i = 0; i < byteString.length; i++) {
      dw.setUint8(i, byteString.charCodeAt(i));
    }
    return new Blob([ab], { type: mimeString });
  }

  handlePrint() {
    const createMapImage = () => {
      this.context.map.updateSize();
      this.context.map.once('postcompose', () => {
        const element = document.querySelector('.ci-template');

        html2canvas(element, { scale: 3 }).then(canvas => {
          const dataURL = canvas.toDataURL("image/jpeg");
          const blob = this.dataURItoBlob(dataURL);
          FileSaver.saveAs(blob, 'CzechInvest_mapa.jpeg');
        });
      });
      
    }

    //const oldRatio = this.state.ratio;
    // this.setState({ ratio: 10 });
    
    setTimeout(createMapImage, 0);
  }

  handleDeActivatePrint() {
    const { activatePrint } = this.props;
    const district = document.querySelector('.districts-panel');
    const districtWraper = document.querySelector('.districts-panel-wrapper');
    const dpAnchor = document.querySelector('#districts-panel-anchor');
    if (dpAnchor.innerHTML !== '' && district) {
      districtWraper.appendChild(district);
    }
    this.setMapContainer('#map-container');
    activatePrint(false);
  }

  handleAddDistrictPanel() {
    const district = document.querySelector('.districts-panel');
    const districtWraper = document.querySelector('.districts-panel-wrapper');
    const dpAnchor = document.querySelector('#districts-panel-anchor');
    if (dpAnchor.innerHTML === '') {
      dpAnchor.appendChild(district);
    } else {
      districtWraper.appendChild(district);
    }
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
        <img alt="" className="logo" src="img/plusko.png" />
      </div>
    );
  }

  renderComponent() {
    const { lang, districts } = this.props;
    const { width, height, ratio } = this.state;

    const style = {
      width: `${width * ratio}mm`,
      height: `${height * ratio}mm`
    };

    return (
      <div className="ci-template-backdrop">
        <div className="ci-template-buttons">

          <button onClick={this.handleDeActivatePrint} 
            title={messages['closePrint'][lang]}
          >
            <Icon glyph="times-solid" />
          </button>
          <Baselayer />
          { !!districts.size && 
            <button onClick={this.handleAddDistrictPanel} title={messages['addComparing'][lang]} >
              <Icon glyph="chart-bar-solid" />
            </button> 
          }
          <a className="ci-print-download" download={"czechinvest.jpeg"} onClick={this.handlePrint} title={messages['createImage'][lang]}>
            <Icon glyph="print-solid" />
          </a>
        </div>
        <div className="ci-template" style={style}>
          <div id="templateMap" />
          { this.renderTopPanel() }
          { this.renderBottomPanel() }
          <div id="districts-panel-anchor" />
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
  lang: PropTypes.string.isRequired,
};


PrintTemplate.contextTypes = {
  map: PropTypes.object
};


export default connect(state => ({
  active: state.print.active,
  lang: state.lang.selectedLanguage,
  districts: state.districts.districts,
}), dispatch => bindActionCreators({
    activatePrint
}, dispatch))(PrintTemplate);
