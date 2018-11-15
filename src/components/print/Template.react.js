import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { activatePrint } from './actions';
import Icon from '../../Icon';
import logo from '../../assets/img/logo_CI.svg';
import html2pdf from 'html2pdf.js';
import './Template.scss';

import html2canvas from 'html2canvas';


class PrintTemplate extends React.Component {
  constructor() {
    super();
    this.handlePrint = this.handlePrint.bind(this);
    this.handleDeActivatePrint = this.handleDeActivatePrint.bind(this);
    this.state = { width: 210, height: 148, units: 'mm' };
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
      margin:       0,
      filename:     'myfile.pdf',
      image:        { type: 'jpeg', quality: 1 },
      html2canvas:  { scale: 4 },
      jsPDF:        { unit: 'mm', format: [height + 1, width + 1], orientation: 'landscape' }
    };
    html2pdf().set(options).from(element).save();
  }

  handleDeActivatePrint() {
    const { activatePrint } = this.props;
    this.setMapContainer('#map-container');
    activatePrint(false);
  }


  renderTopPanel() {
    return (
      <div className="main-menu">
        {
        false && <div className="logo-container">
          <img className="logo" src={logo} alt="CzechInvest" />
        </div>
        }
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
        <Icon className="logo" glyph="plusko" />
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
            close
          </button>
          <button onClick={this.handlePrint}>
            print
          </button>
        </div>
        <div className="ci-template" style={style}>
          <div id="templateMap" />
          { this.renderTopPanel() }
          { this.renderBottomPanel() }
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
