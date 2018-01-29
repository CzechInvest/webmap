import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import Icon from '../../Icon';
import messages from '../lang/messages/app';
import Backdrop from '../backdrop/Backdrop.react';
import { setLanguage } from '../lang/actions';
import './Contact.scss';


class Contact extends React.Component {

  constructor(props) {
    super(props);
    this.state = {open: false};
  }

  render() {
    const { lang, setLanguage } = this.props;
    return (
      <div className="contact-panel">
        <Icon className="logo" glyph="plusko" />
        <button
          className="contact"
          onClick={() => this.setState({open: true})}
        >
          <Icon glyph="contact" />
        </button>

        <ul className="lang">
          <li className={lang === 'cs' ? 'active' : ''} onClick={() => {setLanguage('cs')}}>CZ</li>
          <li className={lang === 'en' ? 'active' : ''} onClick={() => {setLanguage('en')}}>EN</li>
        </ul>

        <TransitionGroup>
          {this.state.open &&
          <CSSTransition classNames="fade" timeout={{ enter: 300, exit: 300 }}>
            <Backdrop zIndex="150" onClose={() => this.setState({open: false})}>
              <div className="contacts-panel">
                <button
                  className="close-btn"
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
  setLanguage
}, dispatch))(Contact);
