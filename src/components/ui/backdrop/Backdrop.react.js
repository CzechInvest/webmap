import React from 'react';
import ReactDOM from 'react-dom'
import './Backdrop.scss';


export default class Backdrop extends React.Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
    this.el.className = 'portal-container';
  }

  onClick(evt) {
    this.props.onClose(evt);
    evt.stopPropagation();
  }

  componentDidMount() {
    document.body.appendChild(this.el);
  }

  componentWillUnmount() {
    document.body.removeChild(this.el);
  }

  render() {
    const { zIndex, onClose, children } = this.props;
    let backdrop;
    if (onClose) {
      backdrop = (
        <div className="backdrop-container" style={{zIndex: zIndex || 80}}>
          <div className="backdrop" onClick={(evt) => this.onClick(evt)}></div>
          { children }
        </div>
      );
    }
    return ReactDOM.createPortal(backdrop || this.props.children, this.el);
  }
}
