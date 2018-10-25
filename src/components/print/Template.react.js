import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { activatePrint } from './actions';
import Panel from '../bottom-panel/Panel.react';
import Icon from '../../Icon';
import logo from '../../assets/img/logo_CI.svg';
import './Template.scss';


class PrintTemplate extends React.Component {
  constructor() {
    super();
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    const { activatePrint, active } = this.props;
    activatePrint(!!active);
  }

  renderTopPanel() {
    return (
      <div className="main-menu">
        <div className="logo-container">
          <img className="logo" src={logo} alt="CzechInvest" />
        </div>
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

    return (
      <div className="ci-template-backdrop">
        <div className="ci-template">
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
