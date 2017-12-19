import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Icon from '../../Icon';
import messages from '../lang/messages/app';
import Backdrop from '../backdrop/Backdrop.react';
import './Contact.scss';
import aboutLogo from '../../assets/img/plusko.svg';

import { CSSTransition, TransitionGroup } from 'react-transition-group';

class Contact extends React.Component {

  constructor(props) {
    super(props);
    this.state = {open: false};
  }

  render() {
    const { lang } = this.props;
    return (
      <div className="contact-panel">
        <button className="about">
          <img src={aboutLogo} />
        </button>
        <button
          className="contact"
          onClick={() => this.setState({open: true})}
        >
          <Icon glyph="contact" />
        </button>
        <TransitionGroup>
          {this.state.open &&
          <CSSTransition classNames="backdrop" timeout={{ enter: 300, exit: 300 }}>
            <Backdrop onClose={() => this.setState({open: false})}>
              <div className="contacts-panel">
                <button
                  className="ol-popup-closer"
                  onClick={() => this.setState({open: false})} />
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
            </Backdrop>
          </CSSTransition>}
        </TransitionGroup>
      </div>
    );
  }
}

export default connect(state => ({
  lang: state.lang.selectedLanguage
}), dispatch => bindActionCreators({
}, dispatch))(Contact);
