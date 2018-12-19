import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { activatePrint } from './actions';
import Icon from '../../Icon';
import messages from '../lang/messages/app';

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
        <button className="ci-print-button" onClick={this.onClick}
          title={messages['printButtonTitle'][lang]}
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
  lang: PropTypes.string.isRequired,
};


PrintButton.contextTypes = {
  map: PropTypes.object
};


export default connect(state => ({
  active: state.print.active,
  lang: state.lang.selectedLanguage,
}), dispatch => bindActionCreators({
    activatePrint
}, dispatch))(PrintButton);
