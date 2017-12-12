import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Icon from '../../Icon';
import messages from '../lang/messages/app';
import Backdrop from '../backdrop/Backdrop.react';
import './Contact.scss';


class Contact extends React.Component {

  constructor(props) {
    super(props);
    this.state = {open: false};
  }

  render() {
    const { lang } = this.props;
    return (
      <button
        className="contact-box"
        onClick={() => this.setState({open: true})}
      >
        <img className="logo-ci2" src="img/logo-cz.png" alt="CzechInvest" />
        <Icon glyph="contact" />
        {this.state.open && <Backdrop onClose={() => this.setState({open: false})}>
          <div className="contacts-panel">
            <h3>{messages['contact'][lang]}</h3>
            <table>
              <tbody>
                <tr>
                  <td className="label">{messages['phone'][lang]}</td>
                  <td>296 342 500</td>
                </tr>
                <tr>
                  <td className="label">{messages['mobilePhone'][lang]}</td>
                  <td>+420 296 342 456 (podatelna)</td>
                </tr>
                <tr>
                  <td className="label">{messages['email'][lang]}</td>
                  <td><a href="mailto:info@czechinvest.org">info@czechinvest.org</a></td>
                </tr>
                <tr>
                  <td className="label">{messages['address'][lang]}</td>
                  <td>
                    Agentura pro podporu podnikání a investic CzechInvest<br />
                    Štěpánská 15<br />
                    120 00 Praha 2<br />
                    Česká republika
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Backdrop>}
      </button>
    );
  }
}

export default connect(state => ({
  lang: state.lang.selectedLanguage
}), dispatch => bindActionCreators({
}, dispatch))(Contact);
