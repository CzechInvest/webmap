import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { activatePrint } from './actions';
import Template from './Template.react';
import Icon from '../../Icon';

import './Print.scss';



class PrintButton extends React.Component {
  constructor() {
    super();
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    const { activatePrint, active } = this.props;
    activatePrint(!active);
  }

  render() {
    const { lang, active } = this.props;
    return (
      <span>
        { active && <Template /> }
        <button className="ci-print-button" onClick={this.onClick}
          // title={messages['PrintButtonTitle'][lang]}
        >
          <Icon glyph={'image'} />
        </button>
      </span>
    );
  }
}


PrintButton.propTypes = {
  active: PropTypes.bool.isRequired,
  activatePrint: PropTypes.func.isRequired,
};


PrintButton.contextTypes = {
  map: PropTypes.object
};


export default connect(state => ({
  active: state.print.active,
}), dispatch => bindActionCreators({
    activatePrint
}, dispatch))(PrintButton);
